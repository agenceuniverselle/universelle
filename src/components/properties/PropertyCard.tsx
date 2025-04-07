
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Property } from '@/context/PropertiesContext';
import { Link } from 'react-router-dom';
import { 
  MapPin, 
  Bath, 
  Bed, 
  Ruler,
  DollarSign,
  Eye 
} from 'lucide-react';

interface PropertyCardProps {
  property: Property;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
      <div className="relative h-48 overflow-hidden">
        <img
          src={property.image}
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute top-3 left-3">
          <Badge variant={property.status === 'Disponible' ? 'default' : 
                         property.status === 'Réservé' ? 'secondary' : 
                         'outline'}
                 className={property.status === 'Disponible' ? 'bg-green-500' : 
                           property.status === 'Réservé' ? 'bg-amber-500' : 
                           'bg-white text-gray-800'}>
            {property.status}
          </Badge>
        </div>
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="text-white font-semibold text-lg truncate">{property.title}</h3>
          <div className="flex items-center text-white/80 text-sm">
            <MapPin className="h-3 w-3 mr-1" />
            <span className="truncate">{property.location}</span>
          </div>
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="font-bold text-lg flex items-center">
            <DollarSign className="h-5 w-5 mr-1 text-luxe-blue" />
            {property.price}
          </div>
          <Badge variant="outline" className="font-normal">
            {property.type}
          </Badge>
        </div>
        
        <div className="grid grid-cols-3 gap-2 mb-4">
          {Number(property.bedrooms) > 0 && (
            <div className="flex items-center">
              <Bed className="h-4 w-4 mr-1.5 text-gray-500" />
              <span className="text-sm">{property.bedrooms} ch.</span>
            </div>
          )}
          
          {Number(property.bathrooms) > 0 && (
            <div className="flex items-center">
              <Bath className="h-4 w-4 mr-1.5 text-gray-500" />
              <span className="text-sm">{property.bathrooms} sdb.</span>
            </div>
          )}
          
          <div className="flex items-center">
            <Ruler className="h-4 w-4 mr-1.5 text-gray-500" />
            <span className="text-sm">{property.area}</span>
          </div>
        </div>
        
        <p className="text-gray-600 text-sm line-clamp-2">
          {property.description || "Aucune description disponible pour ce bien."}
        </p>
      </CardContent>
      
      <CardFooter className="p-4 bg-gray-50 border-t">
        <Link to={`/bien/${property.id}`} className="w-full">
          <Button className="w-full bg-luxe-blue hover:bg-luxe-blue/90">
            <Eye className="h-4 w-4 mr-2" />
            Voir le bien
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default PropertyCard;
