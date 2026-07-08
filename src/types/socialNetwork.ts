export interface SocialNetwork {
  id: string;
  name: string;
  iconPublicId: string;
  icon : string;
  createdAt: string;
  updatedAt: string;
}

export interface SocialLink {
  id: string;
  anfitrionaProfileId: string;
  socialNetworkId: string;
  profileUrl: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  url: string;
  socialNetwork: SocialNetwork;
}

export interface CreateSocialLinkPayload {
  socialNetworkId: string;
  profileUrl: string;
}

export interface UpdateSocialLinkPayload {
  profileUrl: string;
}
