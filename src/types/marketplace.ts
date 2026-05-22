export type ListingStatus = "active" | "inactive" | "draft" | "sold";

export interface ListingImage {
  url: string;
  publicId: string;
}

export interface MarketplaceListing {
  id: string;
  organization_id: string;
  title: string;
  description: string;
  images: ListingImage[] | undefined;
  price: number;
  currency: string;
  status: ListingStatus;
  created_at: string;
  updated_at: string;
  installment?: ListingInstallment;
  organization?: {
    id: string;
    name: string;
    logo_url?: string | null;
  };
}

export interface ListingInstallment {
  enabled: boolean;
  count: number;
  interval: "weekly" | "monthly";
}

export interface CreateListingDto {
  title: string;
  description: string;
  price: number;
  currency: string;
  status: ListingStatus;
  images: ListingImage[];
  installment?: ListingInstallment;
}

export type UpdateListingDto = Partial<CreateListingDto>;
