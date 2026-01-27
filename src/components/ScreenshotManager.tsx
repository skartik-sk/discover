import { useState, useEffect } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Upload, X, GripVertical, Image as ImageIcon } from 'lucide-react';

export interface ScreenshotItem {
  id: string;
  url?: string;
  file?: File;
  preview: string;
  storageId?: string; // Add storage ID for existing screenshots
}

interface ScreenshotManagerProps {
  initialScreenshots: ScreenshotItem[];
  onChange: (screenshots: ScreenshotItem[]) => void;
  maxScreenshots?: number;
}

function SortableScreenshot({ screenshot, onRemove, index }: { screenshot: ScreenshotItem; onRemove: () => void; index: number }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: screenshot.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative group bg-neutral-900 rounded-xl overflow-hidden border-2 border-neutral-800 hover:border-lime-primary/50 transition-colors"
    >
      {/* Order Badge */}
      <div className="absolute top-2 left-2 w-8 h-8 bg-black/80 rounded-full flex items-center justify-center text-lime-primary font-bold text-sm z-10">
        {index + 1}
      </div>

      {/* Drag Handle */}
      <button
        type="button"
        className="absolute top-2 right-2 p-2 bg-black/80 rounded-lg cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity z-10"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="w-4 h-4 text-white" />
      </button>

      {/* Screenshot Image */}
      <img
        src={screenshot.preview}
        alt={`Screenshot ${index + 1}`}
        className="w-full h-48 object-cover"
      />

      {/* Remove Button */}
      <button
        type="button"
        onClick={onRemove}
        className="absolute bottom-2 right-2 p-2 bg-red-500/90 rounded-lg hover:bg-red-500 transition-colors z-10"
      >
        <X className="w-4 h-4 text-white" />
      </button>

      {/* Overlay on hover */}
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </div>
  );
}

export function ScreenshotManager({ initialScreenshots, onChange, maxScreenshots = 5 }: ScreenshotManagerProps) {
  const [screenshots, setScreenshots] = useState<ScreenshotItem[]>(initialScreenshots);
  const [uploading, setUploading] = useState(false);

  // Update screenshots when initialScreenshots changes
  useEffect(() => {
    if (initialScreenshots && initialScreenshots.length > 0) {
      setScreenshots(initialScreenshots);
    }
  }, [initialScreenshots]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setScreenshots((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        const reordered = arrayMove(items, oldIndex, newIndex);
        onChange(reordered);
        return reordered;
      });
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    if (screenshots.length + files.length > maxScreenshots) {
      alert(`You can only upload up to ${maxScreenshots} screenshots`);
      return;
    }

    setUploading(true);

    try {
      const newScreenshots: ScreenshotItem[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        if (!file.type.startsWith('image/')) {
          continue;
        }

        // Create preview
        const preview = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });

        newScreenshots.push({
          id: `screenshot-${Date.now()}-${i}`,
          file,
          preview,
        });
      }

      const updated = [...screenshots, ...newScreenshots];
      setScreenshots(updated);
      onChange(updated);
    } catch (error) {
      console.error('Error processing screenshots:', error);
      alert('Error processing screenshots. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = (id: string) => {
    const updated = screenshots.filter((s) => s.id !== id);
    setScreenshots(updated);
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-neutral-300">
          Screenshots ({screenshots.length}/{maxScreenshots})
        </label>
        {screenshots.length < maxScreenshots && (
          <label className="flex items-center gap-2 px-3 py-1.5 bg-lime-primary text-black rounded-lg hover:bg-lime-primary/90 transition-colors text-sm font-medium cursor-pointer">
            <Upload className="w-4 h-4" />
            Add Screenshots
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              disabled={uploading}
            />
          </label>
        )}
      </div>

      {uploading && (
        <div className="flex items-center justify-center p-8 bg-neutral-900 border border-neutral-800 rounded-xl">
          <div className="flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-primary" />
            <p className="text-sm text-neutral-400">Processing screenshots...</p>
          </div>
        </div>
      )}

      {screenshots.length === 0 ? (
        <div className="p-12 bg-neutral-900 border-2 border-dashed border-neutral-800 rounded-xl text-center">
          <ImageIcon className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
          <p className="text-neutral-500 font-medium mb-2">No screenshots added yet</p>
          <p className="text-sm text-neutral-600 mb-4">
            Showcase your project with up to {maxScreenshots} screenshots
          </p>
          <label className="inline-flex items-center gap-2 px-4 py-2 bg-lime-primary text-black rounded-lg hover:bg-lime-primary/90 transition-colors font-medium cursor-pointer">
            <Upload className="w-4 h-4" />
            Upload Screenshots
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              disabled={uploading}
            />
          </label>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={screenshots.map((s) => s.id)} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {screenshots.map((screenshot, index) => (
                <SortableScreenshot
                  key={screenshot.id}
                  screenshot={screenshot}
                  index={index}
                  onRemove={() => handleRemove(screenshot.id)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      <div className="flex items-start gap-2 p-3 bg-neutral-900/50 border border-neutral-800 rounded-xl">
        <ImageIcon className="w-4 h-4 text-neutral-500 mt-0.5 flex-shrink-0" />
        <div className="text-xs text-neutral-500">
          <p className="font-medium text-neutral-400 mb-1">Tips:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Drag screenshots to reorder them</li>
            <li>First screenshot will be the main gallery image</li>
            <li>Maximum {maxScreenshots} screenshots</li>
            <li>Supported formats: JPG, PNG, WebP, GIF</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
