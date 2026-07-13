export interface SocialNetwork {
  id: string;
  name: string;
  iconPublicId: string;
  icon: string;
  createdAt: string;
  updatedAt: string;
}

export interface SocialLink {
  id: string;
  anfitrionaProfileId: string;
  socialNetworkId: string;
  url: string;
  createdAt: string;
  updatedAt: string;
  socialNetwork: SocialNetwork;
}

export interface CreateSocialLinkPayload {
  socialNetworkId: string;
  url: string;
}

export interface UpdateSocialLinkPayload {
  url: string;
}
