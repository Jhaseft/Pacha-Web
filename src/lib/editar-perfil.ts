import { apiAxios } from './apiClient';
import { MyProfileData } from '@/types/perfil';
import { EditProfileFormData } from '@/types/editar-perfil';

export async function apiUpdateProfileWithImages(
  data: EditProfileFormData
): Promise<MyProfileData> {
  const formData = new FormData();

  formData.append('firstName', data.firstName || '');
  formData.append('lastName', data.lastName || '');
  formData.append('username', data.username);
  formData.append('bio', data.bio);

  if (data.avatarFile) {
    formData.append('avatar', data.avatarFile);
  }

  if (data.coverFile) {
    formData.append('cover', data.coverFile);
  }

  const response = await apiAxios.patch('/anfitrionas/me/profile', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
}
