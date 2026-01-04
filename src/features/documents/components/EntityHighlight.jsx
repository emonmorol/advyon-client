import React from 'react';
import { motion } from 'framer-motion';

/**
 * EntityHighlight - Overlay component for highlighting entities on documents
 * @param {Array} entities - Array of entity objects { id, type, text, position: { x, y, width, height } }
 * @param {string|null} activeEntity - ID of the currently active/focused entity
 * @param {function} onEntityClick - Callback when an entity is clicked
 */
const EntityHighlight = ({ 
  entities = [], 
  activeEntity = null,
  onEntityClick 
}) => {
  const getEntityColor = (type) => {
    switch (type?.toLowerCase()) {
      case 'person':
      case 'name':
        return {
          bg: 'bg-blue-500/20',
          border: 'border-blue-500',
          text: 'text-blue-600'
        };
      case 'date':
        return {
          bg: 'bg-purple-500/20',
          border: 'border-purple-500',
          text: 'text-purple-600'
        };
      case 'amount':
      case 'money':
        return {
          bg: 'bg-emerald-500/20',
          border: 'border-emerald-500',
          text: 'text-emerald-600'
        };
      case 'organization':
      case 'company':
        return {
          bg: 'bg-amber-500/20',
          border: 'border-amber-500',
          text: 'text-amber-600'
        };
      case 'location':
      case 'address':
        return {
          bg: 'bg-rose-500/20',
          border: 'border-rose-500',
          text: 'text-rose-600'
        };
      case 'legal':
      case 'reference':
        return {
          bg: 'bg-cyan-500/20',
          border: 'border-cyan-500',
          text: 'text-cyan-600'
        };
      default:
        return {
          bg: 'bg-gray-500/20',
          border: 'border-gray-500',
          text: 'text-gray-600'
        };
    }
  };

  if (entities.length === 0) {
    return null;
  }

  return (
    <div className="absolute inset-0 pointer-events-none">
      {entities.map((entity) => {
        const colors = getEntityColor(entity.type);
        const isActive = activeEntity === entity.id;
        
        return (
          <motion.div
            key={entity.id}
            className={`absolute pointer-events-auto cursor-pointer transition-all duration-200 rounded-sm border-2 ${colors.bg} ${colors.border} ${isActive ? 'ring-2 ring-accent ring-offset-2' : ''}`}
            style={{
              left: `${entity.position?.x || 0}%`,
              top: `${entity.position?.y || 0}%`,
              width: `${entity.position?.width || 10}%`,
              height: `${entity.position?.height || 2}%`,
            }}
            onClick={() => onEntityClick?.(entity)}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ 
              opacity: isActive ? 1 : 0.7, 
              scale: isActive ? 1.02 : 1 
            }}
            whileHover={{ opacity: 1, scale: 1.02 }}
            title={`${entity.type}: ${entity.text}`}
          >
            {/* Tooltip on hover */}
            <div className={`absolute -top-8 left-0 px-2 py-1 rounded text-xs font-medium whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity ${colors.bg} ${colors.text} border ${colors.border}`}>
              <span className="font-semibold uppercase text-[10px]">{entity.type}</span>: {entity.text}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

// Entity Legend Component for reference
export const EntityLegend = () => {
  const entityTypes = [
    { type: 'Person', color: 'bg-blue-500' },
    { type: 'Date', color: 'bg-purple-500' },
    { type: 'Amount', color: 'bg-emerald-500' },
    { type: 'Organization', color: 'bg-amber-500' },
    { type: 'Location', color: 'bg-rose-500' },
    { type: 'Legal Ref', color: 'bg-cyan-500' },
  ];

  return (
    <div className="flex flex-wrap gap-3 p-3 bg-muted/50 rounded-lg">
      {entityTypes.map(({ type, color }) => (
        <div key={type} className="flex items-center gap-1.5">
          <div className={`w-3 h-3 rounded-sm ${color}`} />
          <span className="text-xs text-muted-foreground">{type}</span>
        </div>
      ))}
    </div>
  );
};

export default EntityHighlight;
