import { useMemo, useState } from "react";
import { getFallbackImage, getImageUrl } from "../utils/images";

const ProductImage = ({ src, alt, className, loading = "lazy" }) => {
  const [failedSrc, setFailedSrc] = useState("");
  const fallback = useMemo(() => getFallbackImage(alt), [alt]);
  const resolvedUrl = getImageUrl(src);
  const imageUrl = resolvedUrl && failedSrc !== resolvedUrl ? resolvedUrl : fallback;

  return (
    <img
      src={imageUrl}
      alt={alt}
      className={className}
      loading={loading}
      onError={() => {
        if (resolvedUrl) setFailedSrc(resolvedUrl);
      }}
    />
  );
};

export default ProductImage;
