import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Typography } from '@/components/atoms/Typography';
import { cn } from '@/utils/cn';

export interface AccordionItemProps {
  question: string;
  answer: string;
  defaultOpen?: boolean;
}

export function AccordionItem({ question, answer, defaultOpen = false }: AccordionItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const panelId = `faq-panel-${question.slice(0, 20).replace(/\s+/g, '-')}`;
  const buttonId = `faq-button-${question.slice(0, 20).replace(/\s+/g, '-')}`;

  return (
    <div className="border-b border-white/10 py-4 last:border-0">
      <button
        id={buttonId}
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary rounded-md"
        aria-expanded={isOpen}
        aria-controls={panelId}
      >
        <Typography variant="h4" className="text-lg font-medium text-text-primary pr-4">
          {question}
        </Typography>
        <div
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/5 transition-transform duration-300",
            isOpen ? "rotate-180 bg-accent-primary/10 text-accent-primary" : "text-text-secondary hover:bg-white/10"
          )}
          aria-hidden="true"
        >
          <ChevronDown className="h-4 w-4" />
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id={panelId}
            role="region"
            aria-labelledby={buttonId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
            className="overflow-hidden"
          >
            <div className="pt-4 pb-2">
              <Typography className="text-text-secondary leading-relaxed">
                {answer}
              </Typography>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
