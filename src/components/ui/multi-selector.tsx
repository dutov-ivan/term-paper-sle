import { Button } from "../ui/button";
import { PlusCircle, Trash } from "lucide-react";
import { Select, SelectValue, SelectContent, SelectItem } from "../ui/select";
import { SelectTrigger } from "@radix-ui/react-select";
import { toast } from "sonner";
import type { ReactNode } from "react";

type MultiSelectorProps<T> = {
  title: string;
  selectedItems: T[];
  allItems: T[];
  itemToAdd: T | null;
  setItemToAdd: (item: T | null) => void;
  setSelectedItems: (items: T[]) => void;
  toString: (item: T) => string;
  children?: (item: T) => ReactNode;
};

export function MultiSelector<T extends string | number>({
  title,
  selectedItems,
  allItems,
  itemToAdd,
  setItemToAdd,
  setSelectedItems,
  toString,
  children,
}: MultiSelectorProps<T>) {
  const addItem = () => {
    if (!itemToAdd) {
      toast.error(`Please select a ${title.toLowerCase()} to add.`);
      return;
    }
    if (selectedItems.includes(itemToAdd)) {
      toast.error(`${toString(itemToAdd)} is already selected.`);
      return;
    }
    setSelectedItems([...selectedItems, itemToAdd]);
    setItemToAdd(null);
  };

  const removeItem = (item: T) => {
    setSelectedItems(selectedItems.filter((i) => i !== item));
  };

  const unselectedItems = allItems.filter(
    (item) => !selectedItems.includes(item)
  );

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">{title}</h2>
      {selectedItems.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          {children ? children(item) : <span>{toString(item)}</span>}
          <Button
            onClick={() => removeItem(item)}
            variant="destructive"
            size="icon"
          >
            <Trash size={16} />
          </Button>
        </div>
      ))}

      {unselectedItems.length > 0 && (
        <div className="flex items-center gap-2">
          <Select
            value={itemToAdd?.toString() ?? ""}
            onValueChange={(value) => setItemToAdd(value as T)}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder={`Select ${title.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {unselectedItems.map((item) => (
                <SelectItem key={item.toString()} value={item.toString()}>
                  {toString(item)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={addItem}>
            <PlusCircle size={18} />
          </Button>
        </div>
      )}
    </div>
  );
}
