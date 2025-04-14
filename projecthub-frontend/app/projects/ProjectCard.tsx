import Image from "next/image";
import Link from "next/link";

interface ProjectProps {
    id: number;
    title: string;
    description: string;
    image: string;
}

export default function ProjectCard({ id, title, description, image }: ProjectProps) {
    return (
        <div className="block bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition">
            <Image src={image} alt={title} width={400} height={250} className="w-full h-40 object-cover" />
            <div className="p-4">
                <h3 className="text-xl font-semibold">{title}</h3>
                <p className="text-gray-600 text-sm mt-1">{description}</p>
                <Link href={`/projects/${id}`} className="inline-block mt-3 text-green-600 font-semibold hover:underline">
                    View Details →
                </Link>
            </div>
        </div>
    );
}


