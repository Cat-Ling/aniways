"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { type Settings } from "@/server/db/schema";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const settingsMeta = {
  autoNext: {
    title: "Auto Next Episode",
    description:
      "Automatically play the next episode when the current one ends.",
  },
  autoPlay: {
    title: "Auto Play",
    description: "Automatically play the video when the player is ready.",
  },
  autoUpdateMal: {
    title: "Auto Update MyAnimeList",
    description:
      "Automatically update your MyAnimeList list when you finish an episode.",
  },
  darkMode: {
    title: "Dark Mode",
    description: "Enable dark mode for the website.",
  },
};

const SettingsFormSchema = z.object({
  autoNext: z.boolean(),
  autoPlay: z.boolean(),
  autoUpdateMal: z.boolean(),
  darkMode: z.boolean(),
});

const SettingsPage = () => {
  const { data, isLoading } = api.settings.getSettings.useQuery();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-bold">Settings</h1>
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Settings</h1>
      <SettingsForm
        settings={
          data ?? {
            autoNext: true,
            autoPlay: true,
            autoUpdateMal: false,
            darkMode: true,
          }
        }
      />
    </div>
  );
};

interface SettingsFormProps {
  settings: Settings;
}

const SettingsForm = ({ settings }: SettingsFormProps) => {
  const form = useForm<z.infer<typeof SettingsFormSchema>>({
    resolver: zodResolver(SettingsFormSchema),
    defaultValues: settings,
  });

  const utils = api.useUtils();

  const updateSettings = api.settings.updateSettings.useMutation({
    onSuccess: async (settings) => {
      await utils.settings.getSettings.invalidate();
      toast.success("Settings updated successfully");
      form.reset(settings);
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) => {
          updateSettings.mutate(values);
        })}
        className="flex flex-col gap-6"
      >
        {Object.keys(settingsMeta).map((key) => {
          return (
            <FormField
              key={key}
              control={form.control}
              name={key as keyof typeof settingsMeta}
              render={({ field }) => {
                return (
                  <FormItem className="flex items-center justify-between rounded-md border border-border p-4">
                    <div className="flex flex-col gap-1">
                      <FormLabel className="text-lg font-bold">
                        {settingsMeta[field.name].title}
                      </FormLabel>
                      <FormDescription className="text-muted-foreground">
                        {settingsMeta[field.name].description}
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                );
              }}
            />
          );
        })}
        <Button
          className="w-fit"
          disabled={!form.formState.isDirty || updateSettings.isPending}
        >
          {updateSettings.isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            "Save Settings"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default SettingsPage;
