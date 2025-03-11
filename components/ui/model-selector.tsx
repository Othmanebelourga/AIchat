import * as React from "react";
import { Check, ChevronDown, Sparkles } from "lucide-react";
import { Button } from "./button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { cn } from "@/lib/utils";
import { ModelType } from "@/types/chat";

interface ModelSelectorProps {
  selectedModel: ModelType;
  onModelChange: (model: ModelType) => void;
  className?: string;
}

const models: { value: ModelType; label: string }[] = [
  { value: "mistral-tiny", label: "Mistral Tiny" },
  { value: "mistral-small", label: "Mistral Small" },
  { value: "mistral-medium", label: "Mistral Medium" },
  { value: "mistral-large", label: "Mistral Large" },
];

export function ModelSelector({
  selectedModel,
  onModelChange,
  className,
}: ModelSelectorProps) {
  const selectedModelData = models.find((m) => m.value === selectedModel);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "h-7 border-0 px-2 gap-1.5 text-xs font-medium text-muted-foreground dark:text-zinc-400 hover:bg-muted dark:hover:bg-[#262626] rounded-full",
            className
          )}
        >
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          {selectedModelData?.label.replace('Mistral ', '') || "Select Model"}
          <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="w-48 dark:bg-[#212121] dark:border-[#333]"
      >
        {models.map((model) => (
          <DropdownMenuItem
            key={model.value}
            onClick={() => onModelChange(model.value)}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span>{model.label}</span>
            </div>
            {selectedModel === model.value && (
              <Check className="h-4 w-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 