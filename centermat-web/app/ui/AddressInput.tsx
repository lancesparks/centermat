"use client";

import { useMapsLibrary } from "@vis.gl/react-google-maps";
import { useEffect, useState, useRef } from "react";

interface AddressInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function AddressInput({
  value,
  onChange,
  placeholder = "Start typing an address or venue..."
}: AddressInputProps) {
  const places = useMapsLibrary("places");
  const [sessionToken, setSessionToken] =
    useState<google.maps.places.AutocompleteSessionToken | null>(null);
  const [suggestions, setSuggestions] = useState<
    google.maps.places.AutocompleteSuggestion[]
  >([]);
  const [inputValue, setInputValue] = useState(value || "");
  const [isOpen, setIsOpen] = useState(false);

  // Sync internal state with external form value
  useEffect(() => {
    setInputValue(value || "");
  }, [value]);

  // Create a new Places session token when component mounts
  useEffect(() => {
    if (!places) return;
    setSessionToken(new places.AutocompleteSessionToken());
  }, [places]);

  // Fetch suggestions using the modern Places API
  const handleInputChange = async (text: string) => {
    setInputValue(text);
    onChange(text);

    if (!text.trim() || !places || !sessionToken) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    try {
      const request: google.maps.places.AutocompleteRequest = {
        input: text,
        sessionToken: sessionToken
      };

      const { suggestions: results } =
        await places.AutocompleteSuggestion.fetchAutocompleteSuggestions(
          request
        );
      setSuggestions(results || []);
      setIsOpen(true);
    } catch (err) {
      console.error("Error fetching places suggestions:", err);
    }
  };

  const handleSelect = (
    suggestion: google.maps.places.AutocompleteSuggestion
  ) => {
    const formattedText = suggestion.placePrediction?.text?.text || "";
    setInputValue(formattedText);
    onChange(formattedText);
    setSuggestions([]);
    setIsOpen(false);

    // Refresh session token after selection
    if (places) {
      setSessionToken(new places.AutocompleteSessionToken());
    }
  };

  return (
    <div className="relative w-full">
      <input
        value={inputValue}
        placeholder={placeholder}
        onChange={(e) => handleInputChange(e.target.value)}
        onFocus={() => inputValue.length > 0 && setIsOpen(true)}
        className="w-full bg-paper border-2 border-ink px-4 py-3.5 text-base placeholder:text-ink-mute focus:outline-none focus:border-gold"
      />

      {isOpen && suggestions.length > 0 && (
        <ul className="absolute z-50 left-0 right-0 mt-1 bg-paper border-2 border-ink shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((item, index) => {
            const mainText = item.placePrediction?.mainText?.text;
            const secondaryText = item.placePrediction?.secondaryText?.text;

            return (
              <li
                key={item.placePrediction?.placeId || index}
                onClick={() => handleSelect(item)}
                className="px-4 py-3 hover:bg-gold/20 cursor-pointer border-b border-ivory-line last:border-b-0 text-sm transition-colors"
              >
                <strong className="block text-ink font-bold">{mainText}</strong>
                {secondaryText && (
                  <small className="text-ink-mute text-xs">
                    {secondaryText}
                  </small>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
