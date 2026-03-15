import { useEffect, useRef, useCallback } from 'react';
import cytoscape from 'cytoscape';
import { useEntityGraph } from '../../../hooks/useEntity';
import { ENTITY_BADGE } from '../../../constants/theme';
import type { Entity, Relation, EntityType } from '../../../types/entity.types';

const NODE_COLORS: Record<EntityType, { bg: string; border: string }> = {
  VALORE: { bg: '#FDF3DC', border: '#7C5C00' },
  PRINCIPIO: { bg: '#EBF3FB', border: '#004B8C' },
  NORMA: { bg: '#E3F4EC', border: '#005C2E' },
  ISTITUTO: { bg: '#FDEEE8', border: '#7A2D00' },
  QUESTIONE: { bg: '#F4ECF7', border: '#5B1A70' },
  FUNZIONE: { bg: '#FDF6DC', border: '#5C4A00' },
  LOGICA_INTERPRETATIVA: { bg: '#E8F5F8', border: '#005B6B' },
  GIURISPRUDENZA: { bg: '#F0F0F0', border: '#3D3D3D' },
  TENSIONE: { bg: '#FCEAEA', border: '#8B1A1A' },
};

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
    const colors = NODE_COLORS[node.type];
    elements.push({
      data: {
        id: node.id,
        label: ENTITY_BADGE[node.type],
        fullLabel: node.label,
        short: node.short ?? '',
        bgColor: colors.bg,
        borderColor: node.id === centerId ? '#0066CC' : colors.border,
        textColor: colors.border,
        borderWidth: node.id === centerId ? 3 : 2,
        nodeSize: node.id === centerId ? 44 : 32,
        zonaGrigia: node.zonaGrigia,
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
        lineColor: isTensione ? '#8B1A1A' : '#B0BEC5',
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

  const stableNavigate = useCallback(
    (id: string) => {
      onNavigate(id);
    },
    [onNavigate],
  );

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
      layout: { name: 'preset' },
      userZoomingEnabled: true,
      userPanningEnabled: true,
      boxSelectionEnabled: false,
    });

    // Manual concentric layout with center node fixed at viewport center
    const w = containerRef.current.clientWidth;
    const h = containerRef.current.clientHeight - 33;
    const cx = w / 2;
    const cy2 = h / 2;
    const radius = Math.min(w, h) * 0.35;

    const centerNode = cy.getElementById(entityId);
    centerNode.position({ x: cx, y: cy2 });

    const neighbors = cy.nodes().filter((n) => n.id() !== entityId);
    const count = neighbors.length;
    neighbors.forEach((n, i) => {
      const angle = (2 * Math.PI * i) / Math.max(count, 1) - Math.PI / 2;
      n.position({
        x: cx + radius * Math.cos(angle),
        y: cy2 + radius * Math.sin(angle),
      });
    });

    cy.fit(undefined, 40);
    cy.center();

    cy.on('tap', 'node', (evt) => {
      const nodeId = evt.target.id() as string;
      if (nodeId !== entityId) stableNavigate(nodeId);
    });

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

    // ResizeObserver: re-center on container resize
    const observer = new ResizeObserver(() => {
      if (cyRef.current) {
        cyRef.current.resize();
        cyRef.current.fit(undefined, 40);
      }
    });
    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
      cy.destroy();
      cyRef.current = null;
    };
  }, [graph, entityId, stableNavigate]);

  return (
    <div className="h-full w-full bg-surface border-l border-border">
      <div className="px-3 py-2 border-b border-border bg-white">
        <p className="text-xs font-semibold text-text-secondary">Grafo contestuale</p>
      </div>
      <div ref={containerRef} className="w-full" style={{ height: 'calc(100% - 33px)' }} />
    </div>
  );
}
