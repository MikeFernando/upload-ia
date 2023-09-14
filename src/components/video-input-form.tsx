import { FileVideo, Upload } from "lucide-react";

import { Separator } from "@radix-ui/react-separator";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";

export function videoInputForm() {
  return (
    <form className="space-y-6">
      <label 
        htmlFor="video"
        className="flex flex-col items-center justify-center gap-2 text-sm border border-dashed rounded-md cursor-pointer aspect-video text-muted-foreground hover:bg-primary/5" 
      >
        <FileVideo className="w-4 h-4" />
        Selecione um vídeo
      </label>
      <input type="file" id="video" accept="video/mp4" className="sr-only" />

      <Separator />

      <div className="space-y-2">
        <Label htmlFor="transcription_prompt">Prompt de transcrição</Label>
        <Textarea 
          id="transcription_prompt" 
          placeholder="Inclua palavras-chaves mencionadas no vídeo separadas por vírgula (,)"
          className="h-20 leading-relaxed resize-none"
          />
      </div>

      <Button type="submit" className="w-full">
        <Upload className="w-4 h-4 ml-2" />
        Carregar video
      </Button>
    </form>
  )
} 