import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Loader2, X } from "lucide-react";
import { pluralize } from "@/utils/stringUtils";
import { TopListItemstype } from "@/types";
import { useGetCountriesLookupQuery, useGetPlayersLookupQuery, useGetTeamsLookupQuery } from "@/store/apis";
import { data } from "react-router-dom";

interface TopListSearchModalProps {
  isOpen: boolean;
  itemsType: TopListItemstype;
  gameTitle?: string;
  isSubmitting: boolean;
  onSelectItem: (item: { id: number; name: string; img_src?: string }) => void;
  onClose: () => void;
}

export default function TopListSearchModal({
  isOpen,
  itemsType,
  gameTitle,
  isSubmitting,
  onSelectItem,
  onClose,
}: TopListSearchModalProps) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 400);
    return () => clearTimeout(handler);
  }, [query]);

  let end;
  switch (itemsType) {
    case TopListItemstype.PLAYER:
      end = useGetPlayersLookupQuery;
      break;
    case TopListItemstype.TEAM:
      end = useGetTeamsLookupQuery;
      break;
    case TopListItemstype.COUNTRY:
      end = useGetCountriesLookupQuery;
      break;
    default:
      end = useGetPlayersLookupQuery;

      break;
  }

  const { data, isFetching } = end(
    { query, limit: 12 },
    { skip: query.trim().length < 2 }
  );

  const results = data?.data || [];

  // Auto-focus input on open
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setDebouncedQuery("");
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 16 }}
        transition={{ type: "spring", duration: 0.4 }}
        className="relative z-10 w-full max-w-md bg-surface border border-outline/40 rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-outline/20 bg-surface-variant/30">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-on-surface">
                Search & Select
              </h3>
              {gameTitle && (
                <p className="text-xs text-on-surface-variant/80 mt-0.5 truncate">
                  {gameTitle}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-surface-variant transition-colors cursor-pointer"
            >
              <X className="w-4 h-4 text-on-surface-variant" />
            </button>
          </div>
        </div>

        {/* Search Input */}
        <div className="px-5 py-3 border-b border-outline/10">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/50" />
            <input
              ref={inputRef}
              type="text"
              placeholder={`Search ...`}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={isSubmitting}
              className="w-full bg-surface-container-low border border-outline/30 rounded-xl pl-9 pr-4 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary transition-all disabled:opacity-50"
            />
          </div>
        </div>

        {/* Results List */}
        <div className="max-h-72 overflow-y-auto">
          {query.trim().length < 2 ? (
            <div className="p-6 text-center text-sm text-on-surface-variant/60">
              Type at least 2 characters to search...
            </div>
          ) : isFetching ? (
            <div className="p-6 text-center flex items-center justify-center gap-2 text-sm text-on-surface-variant">
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
              Searching ...
            </div>
          ) : results.length > 0 ? (
            <div className="divide-y divide-outline/10">
              {results.map((item: any) => {
                const name = item.name ?? item.title ?? item.label ?? `Item #${item.value}`;
                const imgSrc = item.img_src ?? item.image_src ?? item.flag_url;
                return (
                  <button
                    key={item.value}
                    type="button"
                    disabled={isSubmitting}
                    onClick={() =>
                      onSelectItem({
                        id: item.value,
                        name: name,
                        img_src: imgSrc,
                      })
                    }
                    className="w-full flex items-center gap-3 px-5 py-3 text-left hover:bg-surface-variant/50 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {imgSrc ? (
                      <img
                        src={imgSrc}
                        alt={name}
                        className="w-9 h-9 rounded-full object-cover bg-surface-variant border border-outline/20 shrink-0"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-surface-variant shrink-0 flex items-center justify-center text-xs font-bold text-on-surface-variant border border-outline/20">
                        {name.charAt(0)}
                      </div>
                    )}
                    <span className="text-sm font-medium text-on-surface truncate">
                      {name}
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="p-6 text-center text-sm text-on-surface-variant/60">
              No results found for "{query}"
            </div>
          )}
        </div>

        {/* Submitting overlay */}
        {isSubmitting && (
          <div className="absolute inset-0 bg-surface/60 backdrop-blur-sm flex items-center justify-center z-20">
            <div className="flex items-center gap-2 text-sm font-semibold text-primary">
              <Loader2 className="w-5 h-5 animate-spin" />
              Checking guess...
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
