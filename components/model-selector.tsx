'use client';

import { startTransition, useEffect, useMemo, useOptimistic, useState } from 'react';

import { saveChatModelAsCookie } from '@/app/(chat)/actions';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { chatModels, getAvailableModels } from '@/lib/ai/models';
import { cn } from '@/lib/utils';

import { CheckCircleFillIcon, ChevronDownIcon } from './icons';

export function ModelSelector({
  selectedModelId,
  className,
}: {
  selectedModelId: string;
} & React.ComponentProps<typeof Button>) {
  const [open, setOpen] = useState(false);
  const [optimisticModelId, setOptimisticModelId] =
    useOptimistic(selectedModelId);

  // Use useEffect to ensure client-side only execution for available models
  const [availableModels, setAvailableModels] = useState<Array<any>>([]);

  useEffect(() => {
    // This runs only on the client, preventing hydration mismatch
    setAvailableModels(getAvailableModels());
  }, []);

  const selectedChatModel = useMemo(
    () => {
      // Default to a safe fallback during server rendering
      if (availableModels.length === 0) {
        return { id: 'xai-grok-2', name: 'xAI Grok-2', description: 'xAI Grok-2 model', provider: 'xai' };
      }
      return availableModels.find((chatModel) => chatModel.id === optimisticModelId) || availableModels[0];
    },
    [optimisticModelId, availableModels],
  );

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        asChild
        className={cn(
          'w-fit data-[state=open]:bg-accent data-[state=open]:text-accent-foreground',
          className,
        )}
      >
        <Button
          data-testid="model-selector"
          variant="outline"
          className="md:px-2 md:h-[34px]"
        >
          {selectedChatModel?.name}
          <ChevronDownIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-[300px]">
        {availableModels.length === 0 ? (
          <DropdownMenuItem disabled>
            <div className="flex flex-col gap-1 items-start">
              <div>No models available</div>
              <div className="text-xs text-muted-foreground">
                Please configure API keys in your .env.local file
              </div>
            </div>
          </DropdownMenuItem>
        ) : (
          // Group models by provider
          Object.entries(
            availableModels.reduce((acc, model) => {
              if (!acc[model.provider]) {
                acc[model.provider] = [];
              }
              acc[model.provider].push(model);
              return acc;
            }, {} as Record<string, typeof availableModels>)
          ).map(([provider, models]) => (
            <div key={provider}>
              <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                {provider.toUpperCase()}
              </div>
              {models.map((chatModel) => {
                const { id } = chatModel;

                return (
                  <DropdownMenuItem
                    data-testid={`model-selector-item-${id}`}
                    key={id}
                    onSelect={() => {
                      setOpen(false);

                      startTransition(() => {
                        setOptimisticModelId(id);
                        saveChatModelAsCookie(id);
                      });
                    }}
                    data-active={id === optimisticModelId}
                    asChild
                  >
                    <button
                      type="button"
                      className="gap-4 group/item flex flex-row justify-between items-center w-full"
                    >
                      <div className="flex flex-col gap-1 items-start">
                        <div>{chatModel.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {chatModel.description}
                        </div>
                      </div>

                      <div className="text-foreground dark:text-foreground opacity-0 group-data-[active=true]/item:opacity-100">
                        <CheckCircleFillIcon />
                      </div>
                    </button>
                  </DropdownMenuItem>
                );
              })}
            </div>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
