import { useEffect, useRef } from 'react';
import cytoscape from 'cytoscape';
import { useEntityGraph } from '../../../hooks/useEntity';
import { ENTITY_BADGE, ENTITY_COLORS } from '../../../constants/theme';
import type { Entity, Relation } from '../../../types/entity.types';

interface Props {
  entityId: string | undefined;
  onNavigate: (id: string) => void;
}

function buildElements(
  nodes: Entity[],
  edges: Relation[],
  centerId: string,
): cytoscape.ElementDefinition[] {
  const elements: cytoscape.ElementDefinition[] = [];

  for (const node of nodes) {
    const colors = ENTITY_COLORS[node.type];
    elements.push({
      data: {
        id: node.id,
        label: ENTITY_BADGE[node.type],
        fullLabel: node.label,
        short: node.short ?? '',
        bgColor: colors.bg,
        borderColor: node.id === centerId ? '#0066CC' : colors.border,
        textColor: colors.color,
        borderWidth: node.id === centerId ? 3 : 1,
        nodeSize: node.id === centerId ? 44 : 32,
        zonaGrigia: node.zonaGrigia,
        type: node.type,
      },
    });
  }

  for (const edge of edges) {
    const isTensione = edge.type === 'TENSIONE';
    elements.push({
      data: {
        id: `e-${edge.id}`,
        source: edge.fromId,
        target: edge.toId,
        label: edge.type.toLowerCase().replace('_', ' '),
        lineColor: isTensione ? '#8B1A1A' : '#D9E4ED',
        lineStyle: isTensione ? 'dashed' : 'solid',
      },
    });
  }

  return elements;
}

export function GraphPanel({ entityId, onNavigate }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<cytoscape.Core | null>(null);
  const { data: graph } = useEntityGraph(entityId);

  useEffect(() => {
    if (!containerRef.current || !graph || !entityId) return;

    const elements = buildElements(graph.nodes, graph.edges, entityId);

    if (cyRef.current) {
      cyRef.current.destroy();
    }

    const cy = cytoscape({
      container: containerRef.current,
      elements,
      style: [
        {
          selector: 'node',
          style: {
            label: 'data(label)',
            'text-valign': 'center',
            'text-halign': 'center',
            'font-family': 'monospace',
            'font-size': '11px',
            'font-weight': 'bold',
            color: 'data(textColor)',
            'background-color': 'data(bgColor)',
            'border-color': 'data(borderColor)',
            'border-width': 'data(borderWidth)',
            width: 'data(nodeSize)',
            height: 'data(nodeSize)',
          },
        },
        {
          selector: 'node[?zonaGrigia]',
          style: {
            'border-color': '#7A5800',
            'border-style': 'dashed',
            'border-width': 2,
          },
        },
        {
          selector: 'edge',
          style: {
            width: 1.5,
            'line-color': 'data(lineColor)',
            'line-style': 'data(lineStyle)' as cytoscape.Css.LineStyle,
            'target-arrow-color': 'data(lineColor)',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
            'arrow-scale': 0.8,
          },
        },
      ],
      layout: {
        name: 'concentric',
        concentric: (node) => (node.id() === entityId ? 2 : 1),
        levelWidth: () => 1,
        minNodeSpacing: 60,
        animate: false,
        fit: true,
        padding: 40,
      },
      userZoomingEnabled: true,
      userPanningEnabled: true,
      boxSelectionEnabled: false,
    });

    cy.on('tap', 'node', (evt) => {
      const nodeId = evt.target.id() as string;
      if (nodeId !== entityId) {
        onNavigate(nodeId);
      }
    });

    // Tooltip on hover
    cy.on('mouseover', 'node', (evt) => {
      const node = evt.target;
      containerRef.current?.setAttribute(
        'title',
        `${node.data('fullLabel') as string}\n${node.data('short') as string}`,
      );
    });
    cy.on('mouseout', 'node', () => {
      containerRef.current?.removeAttribute('title');
    });

    cyRef.current = cy;

    return () => {
      cy.destroy();
      cyRef.current = null;
    };
  }, [graph, entityId, onNavigate]);

  return (
    <div className="h-full w-full bg-surface border-l border-border">
      <div className="px-3 py-2 border-b border-border bg-white">
        <p className="text-xs font-semibold text-text-secondary">Grafo contestuale</p>
      </div>
      <div ref={containerRef} className="w-full" style={{ height: 'calc(100% - 33px)' }} />
    </div>
  );
}
