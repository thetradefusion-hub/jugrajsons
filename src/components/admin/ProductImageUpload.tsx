import { useRef, useState } from 'react';
import { Image as ImageIcon, Link2, Loader2, Plus, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { resolveImageUrl } from '@/lib/images';
import { uploadProductImages } from '@/lib/upload';

interface ProductImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
}

const isValidImageUrl = (value: string): boolean => {
  const trimmed = value.trim();
  if (!trimmed) return false;
  if (trimmed.startsWith('/')) return true;
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
};

const ProductImageUpload = ({ images, onChange }: ProductImageUploadProps) => {
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [urlInput, setUrlInput] = useState('');

  const handleFiles = async (fileList: FileList | null) => {
    if (!fileList?.length) return;

    const files = Array.from(fileList).filter((f) => f.type.startsWith('image/'));
    if (!files.length) {
      toast({
        title: 'Invalid file',
        description: 'Please select image files only (JPEG, PNG, WebP, GIF).',
        variant: 'destructive',
      });
      return;
    }

    setUploading(true);
    try {
      const urls = await uploadProductImages(files);
      onChange([...images, ...urls]);
      toast({
        title: 'Uploaded',
        description: `${urls.length} image${urls.length === 1 ? '' : 's'} added.`,
      });
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast({
        title: 'Upload failed',
        description: err.response?.data?.message || 'Could not upload images. Try again.',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const addImageFromUrl = () => {
    const trimmed = urlInput.trim();
    if (!isValidImageUrl(trimmed)) {
      toast({
        title: 'Invalid URL',
        description: 'Enter a valid http(s) link or path starting with /',
        variant: 'destructive',
      });
      return;
    }
    if (images.includes(trimmed)) {
      toast({
        title: 'Already added',
        description: 'This image URL is already in the list.',
        variant: 'destructive',
      });
      return;
    }
    onChange([...images, trimmed]);
    setUrlInput('');
    toast({
      title: 'Image added',
      description: 'URL image added to product.',
    });
  };

  const removeImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      <div className="space-y-3 rounded-xl border border-border bg-muted/20 p-4">
        <Label className="text-sm font-medium">Upload from device</Label>
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
          <Button
            type="button"
            variant="outline"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
            className="w-full sm:w-auto"
          >
            {uploading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Upload className="mr-2 h-4 w-4" />
            )}
            {uploading ? 'Uploading…' : 'Choose files'}
          </Button>
          <p className="text-xs text-muted-foreground">
            JPEG, PNG, WebP, GIF — max 10MB each (use high-resolution photos)
          </p>
        </div>
      </div>

      <div className="space-y-3 rounded-xl border border-border bg-muted/20 p-4">
        <Label htmlFor="product-image-url" className="text-sm font-medium">
          Or add image URL
        </Label>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Input
            id="product-image-url"
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addImageFromUrl();
              }
            }}
            placeholder="https://example.com/image.jpg"
            className="flex-1"
          />
          <Button
            type="button"
            variant="secondary"
            onClick={addImageFromUrl}
            disabled={!urlInput.trim()}
            className="shrink-0"
          >
            <Link2 className="mr-2 h-4 w-4" />
            Add URL
          </Button>
        </div>
        {urlInput.trim() && isValidImageUrl(urlInput) && (
          <div className="flex items-center gap-3 rounded-lg border border-dashed border-[#E6A817]/30 bg-background p-2">
            <img
              src={resolveImageUrl(urlInput.trim())}
              alt="URL preview"
              className="h-14 w-14 rounded-md object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
            <p className="text-xs text-muted-foreground">Preview — press Add URL to include</p>
          </div>
        )}
      </div>

      <p className="text-xs text-muted-foreground">
        First image is the main product photo. You can mix uploaded files and external URLs.
      </p>

      {images.length === 0 ? (
        <div
          role="button"
          tabIndex={0}
          onClick={() => !uploading && inputRef.current?.click()}
          onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
          className="flex min-h-[120px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#E6A817]/40 bg-muted/30 p-6 text-center transition-colors hover:border-[#E6A817]/60"
        >
          <ImageIcon className="mb-2 h-10 w-10 text-muted-foreground" />
          <p className="text-sm font-medium text-foreground">No images yet</p>
          <p className="mt-1 text-xs text-muted-foreground">Upload files or paste an image URL above</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {images.map((url, index) => (
            <div
              key={`${url}-${index}`}
              className="relative overflow-hidden rounded-xl border border-border bg-muted/20"
            >
              {index === 0 && (
                <span className="absolute left-2 top-2 z-10 rounded-full bg-[#1F3D2B] px-2 py-0.5 text-[10px] font-semibold text-[#F5E9D7]">
                  Main
                </span>
              )}
              <img
                src={resolveImageUrl(url)}
                alt={`Product ${index + 1}`}
                className="aspect-square w-full object-cover"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute right-2 top-2 h-7 w-7"
                onClick={() => removeImage(index)}
                aria-label="Remove image"
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))}
          <button
            type="button"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
            className="flex aspect-square flex-col items-center justify-center rounded-xl border-2 border-dashed border-muted-foreground/30 text-muted-foreground transition-colors hover:border-[#E6A817]/50 hover:text-foreground disabled:opacity-50"
          >
            <Plus className="h-6 w-6" />
            <span className="mt-1 text-xs font-medium">Upload more</span>
          </button>
        </div>
      )}

      {images.length > 0 && (
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Images ({images.length})</Label>
          <ul className="max-h-24 space-y-1 overflow-y-auto text-xs text-muted-foreground">
            {images.map((url, i) => (
              <li key={i} className="truncate font-mono">
                {url}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProductImageUpload;
