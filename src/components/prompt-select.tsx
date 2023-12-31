import { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

import { api } from "@/lib/api";

interface Props {
  onPromptSelected: (template: string) => void;
}
interface Prompt {
  id: string;
  title: string;
  template: string;
}

export function PromptSelect(props: Props) {
  const [prompts, setPrompts] = useState<Prompt[] | null>(null)

  useEffect(() => {
    api.get('/prompts').then(response => {
      setPrompts(response.data)
    })
  }, [])

  function handlePromptSelected(promptId: string) {
    const selectedPrompt = prompts?.find(prompt => prompt.id === promptId)

    if (!selectedPrompt) {
      return 
    }

    props.onPromptSelected(selectedPrompt.template)
  }
 
  return (
    <Select onValueChange={handlePromptSelected}>
      <SelectTrigger>
        <SelectValue placeholder="Selecione um prompt..." />
      </SelectTrigger>

      <SelectContent>
        {prompts?.map(prompt => (
          <>
            <SelectItem key={prompt.id} value={prompt.id}>
              {prompt.title}
            </SelectItem>
          </>
        ))}
      </SelectContent>
    </Select>
  )
}