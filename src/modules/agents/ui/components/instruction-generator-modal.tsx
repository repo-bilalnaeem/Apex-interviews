import { useState } from "react";
import { Button } from "@/components/ui/button";
import ResponsiveDialog from "@/components/responsive-dialog";
import InstructionTemplateGenerator from "./instruction-template-generator";

interface InstructionGeneratorModalProps {
  onInstructionsGenerated: (instructions: string) => void;
}

export const InstructionGeneratorModal = ({
  onInstructionsGenerated,
}: InstructionGeneratorModalProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleTemplateGenerated = (instructions: string) => {
    onInstructionsGenerated(instructions);
    setIsOpen(false);
  };

  return (
    <>
      <Button
        type="button"
        variant="outline"
        onClick={() => setIsOpen(true)}
        className="w-full"
      >
        Generate Instructions from Resume & Job Description
      </Button>

      <ResponsiveDialog
        open={isOpen}
        onOpenChange={setIsOpen}
        title="Generate Instructions"
        description="Upload a resume and job description to automatically generate agent instructions"
      >
        <InstructionTemplateGenerator onTemplateGenerated={handleTemplateGenerated} />
      </ResponsiveDialog>
    </>
  );
};