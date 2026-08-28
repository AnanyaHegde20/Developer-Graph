"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSkeleton } from "@/components/shared/loading";
import { ErrorState, EmptyState } from "@/components/shared/states";
import type { Skill, JobRole } from "@/lib/types";

interface GraphNode {
  id: string;
  label: string;
  type: string;
  color: string;
  size: number;
}

interface GraphLink {
  source: string;
  target: string;
  label: string;
}

interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

const TYPE_COLORS: Record<string, string> = {
  Developer: "#3b82f6",
  Skill: "#10b981",
  Project: "#f59e0b",
  Technology: "#8b5cf6",
  JobRole: "#ef4444",
};

interface NodeInfo {
  id: string;
  label: string;
  type: string;
  details?: Record<string, string>;
}

interface GraphVisualizationProps {
  developerId?: string;
  onNodeSelect?: (node: NodeInfo | null) => void;
  selectedNode?: NodeInfo | null;
  height?: number;
}

export function GraphVisualization({ developerId, onNodeSelect, height = 500 }: GraphVisualizationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [graphData, setGraphData] = useState<GraphData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [highlightedNodes, setHighlightedNodes] = useState<Set<string>>(new Set());
  const [highlightedLinks, setHighlightedLinks] = useState<Set<number>>(new Set());
  const [dimensions, setDimensions] = useState({ width: 800, height });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const w = containerRef.current.offsetWidth;
        setDimensions({ width: w, height: Math.max(height, 400) });
      }
    };
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, [height]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        if (!developerId) {
          setGraphData(null);
          setLoading(false);
          return;
        }

        const [summary, multiHop, roles] = await Promise.all([
          api.getDeveloper(developerId),
          api.getMultiHop(developerId),
          api.getRoles().catch(() => [] as JobRole[]),
        ]);

        const nodes: GraphNode[] = [];
        const links: GraphLink[] = [];
        const addedNodes = new Set<string>();

        const addNode = (id: string, label: string, type: string, size: number) => {
          if (addedNodes.has(id)) return;
          addedNodes.add(id);
          nodes.push({ id, label, type, color: TYPE_COLORS[type] || "#6b7280", size });
        };

        const addLink = (source: string, target: string, label: string) => {
          links.push({ source, target, label });
        };

        const devId = summary.developer.id;
        addNode(devId, summary.developer.name, "Developer", 28);

        summary.skills.forEach((s: Skill) => {
          addNode(s.id, s.name, "Skill", 14);
          addLink(devId, s.id, "HAS_SKILL");
        });

        summary.projects.forEach((p) => {
          addNode(p.id, p.name, "Project", 14);
          addLink(devId, p.id, "WORKED_ON");
        });

        summary.targetRoles.forEach((r: JobRole) => {
          addNode(`role-${r.id}`, r.title, "JobRole", 14);
          addLink(devId, `role-${r.id}`, "TARGETS");
        });

        roles.forEach((r: JobRole) => {
          if (!summary.targetRoles.some((tr: JobRole) => tr.id === r.id)) {
            addNode(`role-${r.id}`, r.title, "JobRole", 10);
          }
        });

        multiHop.forEach((mh) => {
          if (addedNodes.has(mh.projectId)) {
            mh.matchingSkills.forEach((skillName: string) => {
              const skillNode = nodes.find((n) => n.label === skillName && n.type === "Skill");
              if (skillNode) {
                addLink(skillNode.id, mh.projectId, "REQUIRES");
              }
            });
          }

          mh.technologies.forEach((techName: string, ti: number) => {
            const techId = `tech-${mh.projectId}-${ti}`;
            addNode(techId, techName, "Technology", 10);
            addLink(mh.projectId, techId, "USES");
          });
        });

        const relatedResults = await Promise.all(
          summary.skills.slice(0, 5).map((s: Skill) =>
            api.getRelatedSkills(s.id).then((rels) => ({ skillId: s.id, related: rels }))
              .catch(() => ({ skillId: s.id, related: [] as Skill[] }))
          )
        );

        relatedResults.forEach(({ related }) => {
          related.forEach((r: Skill) => {
            addNode(r.id, r.name, "Skill", 10);
          });
        });

        for (const { skillId, related } of relatedResults) {
          related.forEach((r: Skill) => {
            const exists = links.some(
              (l) => (l.source === skillId && l.target === r.id) || (l.source === r.id && l.target === skillId)
            );
            if (!exists) {
              addLink(skillId, r.id, "RELATED_TO");
            }
          });
        }

        setGraphData({ nodes, links });
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Failed to load graph");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [developerId]);

  const handleNodeClick = useCallback(
    (node: GraphNode | null) => {
      if (!node) {
        setHighlightedNodes(new Set());
        setHighlightedLinks(new Set());
        onNodeSelect?.(null);
        return;
      }

      const connectedNodes = new Set<string>([node.id]);
      const connectedLinks = new Set<number>();
      graphData?.links.forEach((link, i) => {
        const src = typeof link.source === "object" ? (link.source as GraphNode).id : link.source;
        const tgt = typeof link.target === "object" ? (link.target as GraphNode).id : link.target;
        if (src === node.id) {
          connectedNodes.add(tgt);
          connectedLinks.add(i);
        }
        if (tgt === node.id) {
          connectedNodes.add(src);
          connectedLinks.add(i);
        }
      });

      setHighlightedNodes(connectedNodes);
      setHighlightedLinks(connectedLinks);

      onNodeSelect?.({
        id: node.id,
        label: node.label,
        type: node.type,
        details: graphData?.links
          .filter((l) => {
            const src = typeof l.source === "object" ? (l.source as GraphNode).id : l.source;
            const tgt = typeof l.target === "object" ? (l.target as GraphNode).id : l.target;
            return src === node.id || tgt === node.id;
          })
          .reduce<Record<string, string>>((acc, l) => {
            const src = typeof l.source === "object" ? (l.source as GraphNode).id : l.source;
            const tgt = typeof l.target === "object" ? (l.target as GraphNode).id : l.target;
            const otherId = src === node.id ? tgt : src;
            const otherNode = graphData?.nodes.find((n) => n.id === otherId);
            if (otherNode) {
              acc[l.label] = otherNode.label;
            }
            return acc;
          }, {}),
      });
    },
    [graphData, onNodeSelect]
  );

  if (loading) return <LoadingSkeleton count={1} />;
  if (error) return <ErrorState message={error} />;
  if (!graphData || graphData.nodes.length === 0) return <EmptyState title="No graph data" description="Select a developer to explore their graph." />;

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Graph Visualization</CardTitle>
          <div className="flex flex-wrap gap-3">
            {Object.entries(TYPE_COLORS).map(([type, color]) => (
              <div key={type} className="flex items-center gap-1.5 text-xs">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                {type}
              </div>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div
          ref={containerRef}
          className="w-full relative"
          style={{ height: dimensions.height }}
        >
          <GraphCanvas
            data={graphData}
            width={dimensions.width}
            height={dimensions.height}
            highlightedNodes={highlightedNodes}
            highlightedLinks={highlightedLinks}
            onNodeClick={handleNodeClick}
          />
        </div>
      </CardContent>
    </Card>
  );
}

interface GraphCanvasProps {
  data: GraphData;
  width: number;
  height: number;
  highlightedNodes: Set<string>;
  highlightedLinks: Set<number>;
  onNodeClick: (node: GraphNode | null) => void;
}

function GraphCanvas({ data, width, height, highlightedNodes, highlightedLinks, onNodeClick }: GraphCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const simRef = useRef<{
    nodes: Array<GraphNode & { x: number; y: number; vx: number; vy: number }>;
    links: Array<GraphLink & { source: string; target: string }>;
    frame: number;
  } | null>(null);
  const dragRef = useRef<{ node: GraphNode & { x: number; y: number; vx: number; vy: number } | null; offsetX: number; offsetY: number }>({ node: null, offsetX: 0, offsetY: 0 });
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    const nodes = data.nodes.map((n) => ({
      ...n,
      x: width / 2 + (Math.random() - 0.5) * width * 0.6,
      y: height / 2 + (Math.random() - 0.5) * height * 0.6,
      vx: 0,
      vy: 0,
    }));

    const links = data.links.map((l) => ({ ...l }));

    simRef.current = { nodes, links, frame: 0 };

    let animFrame: number;

    const tick = () => {
      if (!simRef.current) return;
      simRef.current.frame++;

      const alpha = Math.max(0.001, 1 - simRef.current.frame / 300);
      const centerForce = 0.01 * alpha;
      const repulsion = 200 * alpha;
      const linkForce = 0.05 * alpha;
      const damping = 0.85;

      nodes.forEach((n) => {
        n.vx += (width / 2 - n.x) * centerForce;
        n.vy += (height / 2 - n.y) * centerForce;
      });

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[j].x - nodes[i].x;
          const dy = nodes[j].y - nodes[i].y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const force = repulsion / (dist * dist);
          const fx = (dx / dist) * force;
          const fy = (dy / dist) * force;
          nodes[i].vx -= fx;
          nodes[i].vy -= fy;
          nodes[j].vx += fx;
          nodes[j].vy += fy;
        }
      }

      links.forEach((l) => {
        const source = nodes.find((n) => n.id === l.source);
        const target = nodes.find((n) => n.id === l.target);
        if (!source || !target) return;
        const dx = target.x - source.x;
        const dy = target.y - source.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const force = (dist - 120) * linkForce;
        source.vx += (dx / dist) * force;
        source.vy += (dy / dist) * force;
        target.vx -= (dx / dist) * force;
        target.vy -= (dy / dist) * force;
      });

      nodes.forEach((n) => {
        if (dragRef.current.node?.id === n.id) return;
        n.vx *= damping;
        n.vy *= damping;
        n.x += n.vx;
        n.y += n.vy;
        n.x = Math.max(30, Math.min(width - 30, n.x));
        n.y = Math.max(30, Math.min(height - 30, n.y));
      });

      ctx.clearRect(0, 0, width, height);

      links.forEach((l, i) => {
        const source = nodes.find((n) => n.id === l.source);
        const target = nodes.find((n) => n.id === l.target);
        if (!source || !target) return;

        const isHighlighted = highlightedLinks.size === 0 || highlightedLinks.has(i);
        const isHovered = highlightedNodes.size > 0 && highlightedNodes.has(source.id) && highlightedNodes.has(target.id);

        ctx.beginPath();
        ctx.moveTo(source.x, source.y);
        ctx.lineTo(target.x, target.y);
        ctx.strokeStyle = isHovered ? "#374151" : isHighlighted ? "#d1d5db" : "#f3f4f6";
        ctx.lineWidth = isHovered ? 2 : 1;
        ctx.stroke();

        if (isHighlighted || highlightedLinks.size === 0) {
          const midX = (source.x + target.x) / 2;
          const midY = (source.y + target.y) / 2;
          ctx.fillStyle = isHovered ? "#374151" : "#9ca3af";
          ctx.font = "9px sans-serif";
          ctx.textAlign = "center";
          ctx.fillText(l.label, midX, midY - 4);
        }
      });

      nodes.forEach((n) => {
        const isHighlighted = highlightedNodes.size === 0 || highlightedNodes.has(n.id);
        const isHovered = hoveredNode === n.id;
        const isSelected = highlightedNodes.has(n.id) && highlightedNodes.size === 1;

        ctx.beginPath();
        ctx.arc(n.x, n.y, n.size, 0, Math.PI * 2);
        ctx.fillStyle = isHighlighted ? n.color : `${n.color}40`;
        ctx.fill();

        if (isHovered || isSelected) {
          ctx.strokeStyle = "#1f2937";
          ctx.lineWidth = 3;
          ctx.stroke();
        } else if (isHighlighted) {
          ctx.strokeStyle = "#fff";
          ctx.lineWidth = 2;
          ctx.stroke();
        }

        ctx.fillStyle = isHighlighted ? "#1f2937" : "#9ca3af";
        ctx.font = n.type === "Developer" ? "bold 12px sans-serif" : "10px sans-serif";
        ctx.textAlign = "center";
        const displayLabel = n.label.length > 20 ? n.label.slice(0, 18) + "..." : n.label;
        ctx.fillText(displayLabel, n.x, n.y + n.size + 14);
      });

      if (simRef.current.frame < 300) {
        animFrame = requestAnimationFrame(tick);
      }
    };

    animFrame = requestAnimationFrame(tick);

    const getNodeAt = (x: number, y: number) => {
      for (const n of nodes) {
        const dx = x - n.x;
        const dy = y - n.y;
        if (dx * dx + dy * dy <= (n.size + 4) * (n.size + 4)) return n;
      }
      return null;
    };

    const getCanvasCoords = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const handleMouseDown = (e: MouseEvent) => {
      const { x, y } = getCanvasCoords(e);
      const node = getNodeAt(x, y);
      if (node) {
        dragRef.current = { node, offsetX: x - node.x, offsetY: y - node.y };
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const { x, y } = getCanvasCoords(e);

      if (dragRef.current.node) {
        dragRef.current.node.x = x - dragRef.current.offsetX;
        dragRef.current.node.y = y - dragRef.current.offsetY;
        dragRef.current.node.vx = 0;
        dragRef.current.node.vy = 0;
        return;
      }

      const node = getNodeAt(x, y);
      setHoveredNode(node?.id || null);
      canvas.style.cursor = node ? "pointer" : "default";
    };

    const handleMouseUp = (e: MouseEvent) => {
      const { x, y } = getCanvasCoords(e);
      const node = getNodeAt(x, y);

      if (dragRef.current.node && (Math.abs(x - dragRef.current.node.x - dragRef.current.offsetX) > 2 || Math.abs(y - dragRef.current.node.y - dragRef.current.offsetY) > 2)) {
        // It was a drag, not a click
      } else if (node) {
        onNodeClick(node);
      } else {
        onNodeClick(null);
      }

      dragRef.current = { node: null, offsetX: 0, offsetY: 0 };
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      const node = getNodeAt(x, y);
      if (node) {
        dragRef.current = { node, offsetX: x - node.x, offsetY: y - node.y };
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length !== 1 || !dragRef.current.node) return;
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      dragRef.current.node.x = x - dragRef.current.offsetX;
      dragRef.current.node.y = y - dragRef.current.offsetY;
      dragRef.current.node.vx = 0;
      dragRef.current.node.vy = 0;
    };

    const handleTouchEnd = () => {
      if (!dragRef.current.node) return;
      const node = dragRef.current.node;
      onNodeClick(node);
      dragRef.current = { node: null, offsetX: 0, offsetY: 0 };
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("touchstart", handleTouchStart, { passive: false });
    canvas.addEventListener("touchmove", handleTouchMove, { passive: false });
    canvas.addEventListener("touchend", handleTouchEnd);

    return () => {
      cancelAnimationFrame(animFrame);
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("touchstart", handleTouchStart);
      canvas.removeEventListener("touchmove", handleTouchMove);
      canvas.removeEventListener("touchend", handleTouchEnd);
    };
  }, [data, width, height, highlightedNodes, highlightedLinks, onNodeClick, hoveredNode]);

  return <canvas ref={canvasRef} className="w-full rounded-lg" />;
}
