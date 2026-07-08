import { apiAxios } from './apiClient';
import {
  SocialNetwork,
  SocialLink,
  CreateSocialLinkPayload,
  UpdateSocialLinkPayload,
} from '@/types/socialNetwork';

/**
 * Obtener todas las redes sociales disponibles (público)
 */
export const getAllSocialNetworks = async (): Promise<SocialNetwork[]> => {
  const response = await apiAxios.get<SocialNetwork[]>('/social-networks');
  return response.data;
};

/**
 * Obtener una red social por ID (público)
 */
export const getSocialNetworkById = async (id: string): Promise<SocialNetwork> => {
  const response = await apiAxios.get<SocialNetwork>(`/social-networks/${id}`);
  return response.data;
};

/**
 * Obtener todos los social links de una anfitriona (público)
 */
export const getAnfitrioneProfileSocialLinks = async (
  userId: string,
): Promise<SocialLink[]> => {
  const response = await apiAxios.get<SocialLink[]>(`/social-networks/anfitriona/${userId}`);
  return response.data;
};

/**
 * Agregar un social link (protegido - requiere JWT)
 */
export const addSocialLink = async (
  userId: string,
  payload: CreateSocialLinkPayload,
): Promise<SocialLink> => {
  const response = await apiAxios.post<SocialLink>(
    `/social-networks/anfitriona/${userId}/links`,
    payload,
  );
  return response.data;
};

/**
 * Actualizar un social link (protegido - requiere JWT)
 */
export const updateSocialLink = async (
  userId: string,
  linkId: string,
  payload: UpdateSocialLinkPayload,
): Promise<SocialLink> => {
  const response = await apiAxios.put<SocialLink>(
    `/social-networks/anfitriona/${userId}/links/${linkId}`,
    payload,
  );
  return response.data;
};

/**
 * Eliminar un social link (protegido - requiere JWT)
 */
export const deleteSocialLink = async (
  userId: string,
  linkId: string,
): Promise<void> => {
  await apiAxios.delete(
    `/social-networks/anfitriona/${userId}/links/${linkId}`,
  );
};
