-- DROP DATABASE hobby_shop;
CREATE DATABASE hobby_shop;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- DROP TABLE products;
CREATE TABLE products (
    product_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    title text NOT NULL unique,
    description text,
    price integer CHECK (price >= 0),
    created_at timestamp NOT NULL DEFAULT now(),
    updated_at timestamp NOT NULL DEFAULT now()
);

-- DROP TABLE stocks;
CREATE TABLE stocks (
    stock_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id uuid NOT NULL REFERENCES products (product_id) ON DELETE CASCADE,
    count integer CHECK ("count" >= 0),
    created_at timestamp NOT NULL DEFAULT now(),
    updated_at timestamp NOT NULL DEFAULT now()
);

-- DROP FUNCTION IF EXISTS public.trigger_set_timestamp;
CREATE OR REPLACE FUNCTION public.trigger_set_timestamp() RETURNS TRIGGER
LANGUAGE plpgsql
AS $function$
    BEGIN
        NEW.updated_at = now();
        RETURN NEW;
    END;
$function$;

-- DROP TRIGGER IF EXISTS set_timestamp_products;
CREATE TRIGGER set_timestamp_products
BEFORE UPDATE ON products
FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

-- DROP TRIGGER IF EXISTS set_timestamp_stocks;
CREATE TRIGGER set_timestamp_stock
BEFORE UPDATE ON stocks
FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
