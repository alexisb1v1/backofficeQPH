"use client";

import React, { useRef, useState } from "react";
import { resolveApiBaseUrl } from "@/app/shared/utils/api-url";
import { AUTH_COOKIE_NAME, getCookie } from "@/app/features/auth";
import { compressImage } from "@/app/shared/utils/image-compressor";
import {
  UploadCloud,
  CheckCircle,
  X,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";

interface VoucherUploaderProps {
  value?: string;
  onChange: (publicUrl: string) => void;
  folder?: string;
}

export function VoucherUploader({
  value,
  onChange,
  folder = "vouchers",
}: VoucherUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [reductionInfo, setReductionInfo] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg(null);
    setReductionInfo(null);

    // Límite de 15MB antes de comprimir
    if (file.size > 15 * 1024 * 1024) {
      setErrorMsg("El comprobante no debe superar los 15MB.");
      return;
    }

    setIsUploading(true);

    try {
      // 1. Compresión client-side a WebP optimizado
      const compressionResult = await compressImage(file, {
        maxWidth: 1600,
        maxHeight: 2000,
        quality: 0.82,
        targetFormat: "image/webp",
      });

      const fileToUpload = compressionResult.file;
      if (compressionResult.compressionRatio > 0) {
        setReductionInfo(
          `Optimizado (-${compressionResult.compressionRatio}%)`,
        );
      }

      // 2. Solicitar URL prefirmada al backend NestJS
      const token = getCookie(AUTH_COOKIE_NAME);
      const baseUrl = resolveApiBaseUrl();
      const presignedRes = await fetch(`${baseUrl}/media/presigned-url`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: "include",
        body: JSON.stringify({
          filename: fileToUpload.name,
          contentType: fileToUpload.type || "image/webp",
          folder,
        }),
      });

      if (!presignedRes.ok) {
        const errorData = await presignedRes.json().catch(() => null);
        throw new Error(
          errorData?.message || "Error al obtener URL de subida a R2",
        );
      }

      const presignedData = await presignedRes.json();

      // 3. Subir el archivo optimizado a Cloudflare R2 vía PUT
      const uploadRes = await fetch(presignedData.uploadUrl, {
        method: "PUT",
        headers: {
          "Content-Type": fileToUpload.type || "image/webp",
        },
        body: fileToUpload,
      });

      if (!uploadRes.ok) {
        throw new Error(
          "No se pudo subir el voucher al almacenamiento Cloudflare R2.",
        );
      }

      onChange(presignedData.publicUrl);
    } catch (err: any) {
      setErrorMsg(err.message || "Error al procesar la imagen del voucher.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="space-y-1.5">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/png,image/jpeg,image/jpg,image/webp,application/pdf"
        className="hidden"
      />

      {value ? (
        <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container border border-surface-container">
          <div className="flex items-center gap-2 overflow-hidden">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <a
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary font-medium truncate hover:underline"
            >
              {value}
            </a>
            {reductionInfo && (
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold shrink-0">
                {reductionInfo}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={() => onChange("")}
            className="p-1 rounded-lg text-on-surface-variant hover:text-red-600 transition-colors shrink-0"
            title="Quitar voucher"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className="border-2 border-dashed border-surface-container hover:border-primary/50 bg-surface-container-low/50 hover:bg-surface-container-low rounded-xl p-3 flex flex-col items-center justify-center cursor-pointer transition-all"
        >
          {isUploading ? (
            <div className="flex items-center gap-2 text-xs text-primary font-semibold py-1">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Optimizando y subiendo voucher a R2...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs text-on-surface-variant">
              <UploadCloud className="w-4 h-4 text-primary" />
              <span className="font-semibold text-on-surface">
                Subir voucher bancario
              </span>
              <span className="text-[10px] text-on-surface-variant/70">
                (PNG, JPG o WebP - Reducción automática a R2/vouchers)
              </span>
            </div>
          )}
        </div>
      )}

      {errorMsg && <p className="text-[11px] text-red-600">{errorMsg}</p>}
    </div>
  );
}
