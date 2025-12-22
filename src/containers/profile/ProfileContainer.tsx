'use client';

import { useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { profileQueryKey, useProfile } from "@/hooks/useProfile";
import { ProfileActionResult, ProfileData } from "@/types/profile";
import { ProfileFormValues, profileFormSchema } from "@/validation/profile";
import * as S from "./style";

interface ProfileContainerProps {
  initialProfile: ProfileData | null;
  onUpdate: (values: ProfileFormValues) => Promise<ProfileActionResult>;
  fallbackName?: string;
}

const DEFAULT_VALUES: ProfileFormValues = {
  name: "",
  email: "",
};

export default function ProfileContainer({
  initialProfile,
  onUpdate,
  fallbackName,
}: ProfileContainerProps) {
  const queryClient = useQueryClient();
  const { data: profile, isLoading, error } = useProfile(initialProfile ?? undefined);
  const [status, setStatus] = useState<{
    type: "idle" | "success" | "error";
    message?: string;
  }>({
    type: "idle",
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      ...DEFAULT_VALUES,
      name: initialProfile?.name ?? fallbackName ?? "",
      email: initialProfile?.email ?? "",
    },
  });

  useEffect(() => {
    if (profile) {
      reset({
        name: profile.name ?? fallbackName ?? "",
        email: profile.email ?? "",
      });
    }
  }, [profile, reset, fallbackName]);

  const onSubmit = handleSubmit(async (values) => {
    setStatus({ type: "idle" });
    const payload = {
      ...values,
      email: values.email || profile?.email || "",
    };
    const result = await onUpdate(payload).catch(
      (err): ProfileActionResult => ({
        ok: false,
        error: err instanceof Error ? err.message : "요청 중 오류가 발생했어요.",
        profile: undefined,
      }),
    );

    if (result.ok && result.profile) {
      queryClient.setQueryData(profileQueryKey, result.profile);
      setStatus({ type: "success", message: "저장됐어요." });
      return;
    }

    setStatus({
      type: "error",
      message: result.error ?? "저장 실패",
    });
  });

  const statusMessage = useMemo(() => {
    if (status.type === "success") return status.message ?? "저장됨";
    if (status.type === "error") return status.message ?? "실패";
    if (error) return error.message;
    if (isLoading) return "불러오는 중...";
    return "";
  }, [status, error, isLoading]);

  return (
    <S.Container>
      <S.Panel>
        <S.PanelHeader>
          <div>
            <S.PanelTitle>프로필 설정</S.PanelTitle>
          </div>
          {statusMessage && (
            <S.StatusBadge data-kind={status.type}>{statusMessage}</S.StatusBadge>
          )}
        </S.PanelHeader>

        <S.Form onSubmit={onSubmit}>
          <S.Grid>
            <S.Field>
              <S.Label>이름</S.Label>
              <S.Input
                placeholder="세리나"
                {...register("name")}
                aria-invalid={!!errors.name}
              />
              {errors.name && <S.ErrorText>{errors.name.message}</S.ErrorText>}
            </S.Field>
            <S.Field>
              <S.Label>이메일</S.Label>
              <S.Input
                placeholder="you@example.com"
                {...register("email")}
                aria-invalid={!!errors.email}
              />
              {errors.email && <S.ErrorText>{errors.email.message}</S.ErrorText>}
            </S.Field>
          </S.Grid>
          <S.Field>
            <S.Label>아이디</S.Label>
            <S.Input value={profile?.id ?? ""} disabled readOnly />
          </S.Field>

          <S.Actions>
            <S.PrimaryButton type="submit" disabled={isSubmitting}>
              {isSubmitting ? "저장 중..." : "변경사항 저장하기"}
            </S.PrimaryButton>
          </S.Actions>
        </S.Form>
      </S.Panel>
    </S.Container>
  );
}
