import { Box, CircularProgress, Typography } from "@mui/material";
import type { UseFormSetError } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import EditProfileForm from "@/modules/users/components/EditProfileForm";
import EditProfileLayout from "@/modules/users/components/EditProfileLayout";
import type { EditProfileFormValues } from "@/modules/users/schemas/editProfile.schema";
import type { UpdateStudentProfileRequest } from "@/modules/users/interfaces/requests/edit-profile.interface";
import { useMyStudentProfile } from "@/modules/student/profile/hooks/useMyStudentProfile";
import { useUpdateStudentProfile } from "@/modules/student/profile/hooks/useUpdateStudentProfile";
import { studentPaths } from "@/routes/paths";
import type { ErrorResponse } from "@/shared/interfaces/error-response.interface";

export const StudentEditProfilePage = () => {
  const navigate = useNavigate();
  const { data: profile, isLoading, isError } = useMyStudentProfile();
  const { mutate, isPending } = useUpdateStudentProfile();

  if (isLoading) {
    return (
      <Box
        sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}
      >
        <CircularProgress sx={{ color: "#4C5CB5" }} />
      </Box>
    );
  }

  if (isError || !profile) {
    return (
      <Box
        sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}
      >
        <Typography color="error">No se pudo cargar el perfil. Intenta de nuevo.</Typography>
      </Box>
    );
  }

  const defaultValues: EditProfileFormValues = {
    firstName: profile.firstName,
    lastName: profile.lastName,
    dni: profile.dni ?? "",
    phoneNumber: profile.phoneNumber ?? "",
    career: profile.career,
    institutionalId: profile.institutionalId ?? "",
  };

  const handleSubmit = (
    values: EditProfileFormValues,
    setFieldError: UseFormSetError<EditProfileFormValues>
  ) => {
    const request: UpdateStudentProfileRequest = {
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      dni: values.dni.trim(),
      phoneNumber: values.phoneNumber.trim(),
      career: values.career.trim(),
      institutionalId: (values.institutionalId ?? "").trim(),
    };

    mutate(request, {
      onSuccess: () => navigate(studentPaths.profile),
      onError: (error) => {
        if (
          axios.isAxiosError<ErrorResponse>(error) &&
          error.response?.data?.detail === "DUPLICATE_DNI"
        ) {
          setFieldError("dni", { type: "server", message: error.response.data.message });
        }
      },
    });
  };

  return (
    <EditProfileLayout
      role="STUDENT"
      fullName={`${profile.firstName} ${profile.lastName}`}
      profilePictureUrl={profile.profilePictureUrl}
    >
      <EditProfileForm
        key={profile.userId}
        variant="student"
        email={profile.email}
        defaultValues={defaultValues}
        isPending={isPending}
        onSubmit={handleSubmit}
      />
    </EditProfileLayout>
  );
};
