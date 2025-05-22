-- Product history trigger
CREATE OR REPLACE FUNCTION log_product_history()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' OR NEW.price IS DISTINCT FROM OLD.price THEN
    INSERT INTO product_history (external_id, price, start_date, id_product)
    VALUES (NEW.external_id, NEW.price, CURRENT_TIMESTAMP, NEW.id);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_product_history
AFTER INSERT OR UPDATE ON product
FOR EACH ROW
EXECUTE FUNCTION log_product_history();

-- Product group history trigger
CREATE OR REPLACE FUNCTION log_product_group_history()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' OR NEW.price IS DISTINCT FROM OLD.price THEN
    INSERT INTO product_group_history (external_id, price, start_date, id_product_group)
    VALUES (NEW.external_id, NEW.price, CURRENT_TIMESTAMP, NEW.id);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_product_group_history
AFTER INSERT OR UPDATE ON product_group
FOR EACH ROW
EXECUTE FUNCTION log_product_group_history();