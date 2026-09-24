import { useCallback, useEffect, useMemo, useState } from "react";

import {
  personaAuthDefaultModel,
  personaAuthLaunchFields,
  personaAuthModelOptions,
  type PersonaAuth,
} from "@/lib/personaAgentCatalog";

import type { CockpitSelectOption } from "./CockpitSelect";

/**
 * Persona auth picker state for the Survey/Chatbot cockpits. A CLI
 * subscription pins one provider, so the model list (and the selected model)
 * follows the chosen auth; `launchFields` spread into single and batch launches.
 */
export function usePersonaAuth(
  personaModel: string,
  setPersonaModel: (model: string) => void,
  personaModelOptions: CockpitSelectOption[],
) {
  const [personaAuth, setPersonaAuthState] = useState<PersonaAuth>("api");
  const modelOptions = useMemo(
    () => personaAuthModelOptions(personaAuth, personaModelOptions),
    [personaAuth, personaModelOptions],
  );
  const launchFields = useMemo(() => personaAuthLaunchFields(personaAuth), [personaAuth]);

  const setPersonaAuth = useCallback(
    (auth: PersonaAuth) => {
      setPersonaAuthState(auth);
      const preferred = personaAuthDefaultModel(auth);
      if (preferred && personaModelOptions.some((opt) => opt.value === preferred)) {
        setPersonaModel(preferred);
      }
    },
    [personaModelOptions, setPersonaModel],
  );

  useEffect(() => {
    if (personaAuth === "api" || modelOptions.length === 0) return;
    if (!modelOptions.some((opt) => opt.value === personaModel)) {
      setPersonaModel(modelOptions[0].value);
    }
  }, [personaAuth, modelOptions, personaModel, setPersonaModel]);

  return { personaAuth, setPersonaAuth, modelOptions, launchFields };
}
