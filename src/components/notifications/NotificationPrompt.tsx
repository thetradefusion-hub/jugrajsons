import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, X, Gift, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NotificationPromptProps {
  onAllow: () => void;
  onDismiss: () => void;
}

const NotificationPrompt = ({ onAllow, onDismiss }: NotificationPromptProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 50, scale: 0.9 }}
      transition={{ type: "spring", damping: 20 }}
      className="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:w-96 z-50 bg-card rounded-2xl shadow-2xl border border-border overflow-hidden"
    >
      {/* Gradient top bar */}
      <div className="h-1.5 bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-500" />
      
      <div className="p-5">
        {/* Close button */}
        <button
          onClick={onDismiss}
          className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-muted transition-colors"
        >
          <X className="w-4 h-4 text-muted-foreground" />
        </button>

        {/* Icon and content */}
        <div className="flex gap-4">
          <div className="flex-shrink-0">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center shadow-lg">
              <Bell className="w-7 h-7 text-white" />
            </div>
          </div>
          <div className="flex-1 pr-4">
            <h3 className="font-semibold text-foreground mb-1">Stay Updated!</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Get exclusive offers, health tips & order updates delivered to you.
            </p>
          </div>
        </div>

        {/* Benefits */}
        <div className="flex gap-3 mt-4 mb-5">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 px-2.5 py-1.5 rounded-full">
            <Gift className="w-3.5 h-3.5 text-primary" />
            <span>Exclusive Deals</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 px-2.5 py-1.5 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>New Launches</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={onAllow}
            className="flex-1 h-11 rounded-xl bg-gradient-to-r from-primary to-emerald-600 hover:opacity-90"
          >
            Allow Notifications
          </Button>
          <Button
            onClick={onDismiss}
            variant="outline"
            className="h-11 px-4 rounded-xl"
          >
            Later
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default NotificationPrompt;
