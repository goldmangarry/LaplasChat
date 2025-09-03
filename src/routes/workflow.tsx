import { createFileRoute } from "@tanstack/react-router";
import {
	Background,
	Controls,
	type Edge,
	type Node,
	ReactFlow,
	useEdgesState,
	useNodesState,
} from "@xyflow/react";
import { useCallback, useMemo } from "react";
import { SidebarInset } from "@/components/ui/sidebar";
import { TaskNode } from "@/components/workflow/task-node";
import { ChatSidebar } from "@/widgets/chat-sidebar";
import "@xyflow/react/dist/style.css";

function WorkflowPageContent() {
	const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
	const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

	const onConnect = useCallback(
		(params: any) => {
			const newEdge = {
				...params,
				id: `e${params.source}-${params.target}`,
			};
			setEdges((eds) => [...eds, newEdge]);
		},
		[setEdges],
	);

	const generateNodeId = useCallback(() => {
		return Math.max(...nodes.map((node) => parseInt(node.id)), 0) + 1;
	}, [nodes]);

	const onAddLeftNode = useCallback(
		(nodeId: string) => {
			const currentNode = nodes.find((node) => node.id === nodeId);
			if (!currentNode) return;

			const newNodeId = generateNodeId().toString();
			const newNode: Node = {
				id: newNodeId,
				type: "taskNode",
				position: {
					x: currentNode.position.x - 400,
					y: currentNode.position.y,
				},
				data: {
					title: "New Task",
					assignee: "Unassigned",
					status: "pending",
				},
			};

			const newEdge = {
				id: `e${newNodeId}-${nodeId}`,
				source: newNodeId,
				target: nodeId,
			};

			setNodes((nodes) => [...nodes, newNode]);
			setEdges((edges) => [...edges, newEdge]);
		},
		[nodes, setNodes, setEdges, generateNodeId],
	);

	const onAddRightNode = useCallback(
		(nodeId: string) => {
			const currentNode = nodes.find((node) => node.id === nodeId);
			if (!currentNode) return;

			const newNodeId = generateNodeId().toString();
			const newNode: Node = {
				id: newNodeId,
				type: "taskNode",
				position: {
					x: currentNode.position.x + 400,
					y: currentNode.position.y,
				},
				data: {
					title: "New Task",
					assignee: "Unassigned",
					status: "pending",
				},
			};

			const newEdge = {
				id: `e${nodeId}-${newNodeId}`,
				source: nodeId,
				target: newNodeId,
			};

			setNodes((nodes) => [...nodes, newNode]);
			setEdges((edges) => [...edges, newEdge]);
		},
		[nodes, setNodes, setEdges, generateNodeId],
	);

	const onDeleteNode = useCallback(
		(nodeId: string) => {
			setNodes((nodes) => nodes.filter((node) => node.id !== nodeId));
			setEdges((edges) =>
				edges.filter(
					(edge) => edge.source !== nodeId && edge.target !== nodeId,
				),
			);
		},
		[setNodes, setEdges],
	);

	const TaskNodeWithHandlers = useCallback(
		(props: any) => {
			return (
				<TaskNode
					{...props}
					onAddLeftNode={onAddLeftNode}
					onAddRightNode={onAddRightNode}
					onDeleteNode={onDeleteNode}
				/>
			);
		},
		[onAddLeftNode, onAddRightNode, onDeleteNode],
	);

	const nodeTypes = useMemo(
		() => ({
			taskNode: TaskNodeWithHandlers,
		}),
		[TaskNodeWithHandlers],
	);

	return (
		<div className="flex h-full w-full">
			<ReactFlow
				nodes={nodes}
				edges={edges}
				nodeTypes={nodeTypes}
				onNodesChange={onNodesChange}
				onEdgesChange={onEdgesChange}
				onConnect={onConnect}
				nodesDraggable={true}
				nodesConnectable={true}
				elementsSelectable={true}
				panOnDrag={[1, 0]}
				selectNodesOnDrag={false}
			>
				<Background />
				<Controls />
			</ReactFlow>
		</div>
	);
}

const initialNodes: Node[] = [
	{
		id: "1",
		type: "taskNode",
		position: { x: 100, y: 100 },
		data: {
			title: "Define blog editorial goals and themes",
			assignee: "Unassigned",
			status: "pending",
		},
	},
	{
		id: "2",
		type: "taskNode",
		position: { x: 500, y: 100 },
		data: {
			title: "Create content calendar",
			assignee: "Unassigned",
			status: "pending",
		},
	},
];

const initialEdges: Edge[] = [
	{
		id: "e1-2",
		source: "1",
		target: "2",
	},
];

function WorkflowPage() {
	return (
		<>
			<ChatSidebar />
			<SidebarInset>
				<WorkflowPageContent />
			</SidebarInset>
		</>
	);
}

export const Route = createFileRoute("/workflow")({
	component: WorkflowPage,
});
