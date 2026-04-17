import Image from "next/image";

interface Props {
  title: string;
  description: string;
  image?: string;
}

const EmptyState = ({ title, description, image = "/empty.svg" }: Props) => {
  return (
    <div className="flex flex-col flex-1 items-center justify-center">
      {/* <Video /> */}
      <Image src={image} width={256} height={256} alt="Image" />
      <div className="flex flex-col gap-y-6 max-w-md mx-auto text-center">
        <h6 className="text-lg font-medium">{title}</h6>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
};

export default EmptyState;
