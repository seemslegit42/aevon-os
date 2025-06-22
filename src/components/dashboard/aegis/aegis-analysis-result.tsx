
"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { type AegisSecurityAnalysis } from '@/lib/ai-schemas';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import AlertTriangleIcon from '@/components/icons/AlertTriangleIcon';
import CheckCircleIcon from '@/components/icons/CheckCircleIcon';

interface AegisAnalysisResultProps {
  result: AegisSecurityAnalysis;
}

const severityClassMap: { [key: string]: string } = {
  'Critical': 'badge-critical',
  'High': 'badge-high',
  'Medium': 'badge-medium',
  'Low': 'badge-low',
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 100 },
  },
};

const AegisAnalysisResult: React.FC<AegisAnalysisResultProps> = ({ result }) => {
  return (
    <motion.div
      className="p-4 space-y-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="flex items-center gap-3">
        <Badge
          className={cn('text-sm px-3 py-1 border-2', severityClassMap[result.severity])}
        >
          {result.severity} Severity
        </Badge>
        <p className="text-sm font-semibold text-muted-foreground">{result.summary}</p>
      </motion.div>

      <motion.div variants={itemVariants}>
        <h4 className="font-semibold text-primary mb-2">Identified Threats</h4>
        <ul className="space-y-1.5 text-sm text-muted-foreground list-inside">
          {result.identifiedThreats.map((threat, index) => (
            <li key={index} className="flex items-start">
              <AlertTriangleIcon className="w-4 h-4 mr-2 mt-0.5 text-accent flex-shrink-0" />
              <span>{threat}</span>
            </li>
          ))}
        </ul>
      </motion.div>

      <motion.div variants={itemVariants}>
        <h4 className="font-semibold text-primary mb-2">Suggested Actions</h4>
        <ul className="space-y-1.5 text-sm text-muted-foreground list-inside">
          {result.suggestedActions.map((action, index) => (
            <li key={index} className="flex items-start">
                <CheckCircleIcon className="w-4 h-4 mr-2 mt-0.5 text-chart-4 flex-shrink-0" />
                <span>{action}</span>
            </li>
          ))}
        </ul>
      </motion.div>
    </motion.div>
  );
};

export default AegisAnalysisResult;
