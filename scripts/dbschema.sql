-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.banners (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  text text NOT NULL,
  icon text,
  color_hex text DEFAULT '#0000FF'::text,
  is_active boolean NOT NULL DEFAULT true,
  start_date timestamp with time zone DEFAULT now(),
  end_date timestamp with time zone,
  CONSTRAINT banners_pkey PRIMARY KEY (id)
);
CREATE TABLE public.product_images (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  product_id bigint,
  image_url text,
  is_active boolean DEFAULT true,
  is_main boolean DEFAULT false,
  CONSTRAINT product_images_pkey PRIMARY KEY (id),
  CONSTRAINT product_images_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id)
);
CREATE TABLE public.products (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  name text NOT NULL,
  description text,
  model_number text,
  brand text,
  category text,
  price numeric DEFAULT 0,
  wattage integer DEFAULT 0,
  pressure_bar numeric DEFAULT 0,
  horsepower numeric DEFAULT 0,
  amperage numeric DEFAULT 0,
  image_url text,
  extra_details jsonb,
  is_active boolean NOT NULL DEFAULT true,
  subtitle text,
  video_url text,
  CONSTRAINT products_pkey PRIMARY KEY (id)
);