import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bien } from '@/context/BiensContext'; // <-- Changement ici
import { Link, useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  Bath, 
  Bed, 
  Ruler,
  DollarSign,
  Eye 
} from 'lucide-react';

interface BienCardProps {
  bien: Bien;
}

const BienCard: React.FC<BienCardProps> = ({ bien }) => {
const fileName = bien.images[0]?.split('/').pop();
const firstImageUrl = fileName 
  ? `https://back-qhore.ondigitalocean.app/Biens/images/${fileName}` 
  : undefined;


  console.log("Image URL:", firstImageUrl);
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/bien/${bien.id}`); // ici bien est connu
  };
  return (
    <div onClick={() => navigate(`/bien/${bien.id}`)} className="cursor-pointer">

    <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
      <div className="relative h-48 overflow-hidden">
        
      {firstImageUrl ? (
        <img src={firstImageUrl}
            alt={bien.title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
        ) : (
          <p>No image available</p>
        )}
       
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute top-3 left-3">
          <Badge variant={bien.status === 'Disponible' ? 'default' : 
                         bien.status === 'Réservé' ? 'secondary' : 
                         'outline'}
                 className={bien.status === 'Disponible' ? 'bg-green-500' : 
                           bien.status === 'Réservé' ? 'bg-amber-500' : 
                           'bg-white text-gray-800'}>
            {bien.status}
          </Badge>
        </div>
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="text-white font-semibold text-lg truncate">{bien.title}</h3>
          <div className="flex items-center text-white/80 text-sm">
  <MapPin className="h-3 w-3 mr-1" />
  <span className="truncate">
    {bien.location}
    {bien.quartier && `, ${bien.quartier}`}
  </span>
</div>

        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="font-bold text-lg flex items-center">
          {bien.price} MAD/m² 
          </div>
          <Badge variant="outline" className="font-normal">
            {bien.type}
          </Badge>
        </div>
        
        <div className="grid grid-cols-3 gap-2 mb-4">
          {Number(bien.bedrooms) > 0 && (
            <div className="flex items-center">
              <Bed className="h-4 w-4 mr-1.5 text-gray-500" />
              <span className="text-sm">{bien.bedrooms} ch.</span>
            </div>
          )}
          
          {Number(bien.bathrooms) > 0 && (
            <div className="flex items-center">
              <Bath className="h-4 w-4 mr-1.5 text-gray-500" />
              <span className="text-sm">{bien.bathrooms} sdb.</span>
            </div>
          )}
          
          {bien.area && (
  <div className="flex items-center">
    <Ruler className="h-4 w-4 mr-1.5 text-gray-500" />
    <span className="text-sm">{bien.area} m²</span>
  </div>
)}

        </div>
        
        <p className="text-gray-600 text-sm line-clamp-2">
          {bien.description || "Aucune description disponible pour ce bien."}
        </p>
      </CardContent>
      
      <CardFooter className="p-4 bg-gray-50 border-t">
        <Link to={`/bien/${bien.id}`} className="w-full">
          <Button className="w-full bg-luxe-blue hover:bg-luxe-blue/90">
            <Eye className="h-4 w-4 mr-2" />
            Voir le bien
          </Button>
        </Link>
      </CardFooter>
    </Card>
    </div>

  );
};

export default BienCard;
