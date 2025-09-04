import type { NodeProps } from "@xyflow/react";
import { Handle, Position } from "@xyflow/react";
import { Clock, MoreHorizontal, UserPlus, ArrowLeft, ArrowRight, Trash2 } from "lucide-react";
import { useState, memo } from "react";
import { useTranslation } from "react-i18next";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type TaskNodeData = {
	title: string;
	assignee: string;
	status: "pending" | "completed" | "in_progress";
};

type TaskNodeProps = NodeProps & {
	onAddLeftNode?: (nodeId: string) => void;
	onAddRightNode?: (nodeId: string) => void;
	onDeleteNode?: (nodeId: string) => void;
};

export const TaskNode = memo(function TaskNode(props: TaskNodeProps) {
	const { t } = useTranslation();
	const { onAddLeftNode, onAddRightNode, onDeleteNode } = props;
	const data = props.data as TaskNodeData;
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const getStatusIcon = () => {
		switch (data.status) {
			case "pending":
				return <Clock className="w-4 h-4 text-muted-foreground" />;
			case "completed":
				return <div className="w-4 h-4 rounded-full bg-green-500" />;
			case "in_progress":
				return <div className="w-4 h-4 rounded-full bg-blue-500" />;
			default:
				return <Clock className="w-4 h-4 text-muted-foreground" />;
		}
	};

	const getStatusText = () => {
		switch (data.status) {
			case "pending":
				return t("workflow.status.pending");
			case "completed":
				return t("workflow.status.completed");
			case "in_progress":
				return t("workflow.status.inProgress");
			default:
				return t("workflow.status.pending");
		}
	};

	const handleAddLeftNode = () => {
		if (onAddLeftNode) {
			onAddLeftNode(props.id);
		}
		setIsMenuOpen(false);
	};

	const handleAddRightNode = () => {
		if (onAddRightNode) {
			onAddRightNode(props.id);
		}
		setIsMenuOpen(false);
	};

	const handleDeleteTask = () => {
		if (onDeleteNode) {
			onDeleteNode(props.id);
		}
		setIsMenuOpen(false);
	};

	return (
		<div className="bg-card rounded-lg border border-border shadow-lg min-w-[300px]">
			<Handle type="target" position={Position.Left} className="w-3 h-3" />
			
			{/* Header */}
			<div className="flex items-center justify-between p-4 border-b border-border">
				<div className="flex items-center space-x-3">
					<div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
						<UserPlus className="w-5 h-5 text-muted-foreground" />
					</div>
					<span className="text-foreground font-medium">
						{data.assignee === "Unassigned" ? t("workflow.assignee.unassigned") : data.assignee}
					</span>
				</div>
				<DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
					<DropdownMenuTrigger asChild>
						<button 
							className="p-1 hover:bg-muted rounded"
							onPointerDown={(e) => e.stopPropagation()}
							onClick={(e) => e.stopPropagation()}
						>
							<MoreHorizontal className="w-4 h-4 text-muted-foreground" />
						</button>
					</DropdownMenuTrigger>
					<DropdownMenuContent className="w-56" align="end">
						<DropdownMenuItem onClick={handleAddLeftNode} className="flex items-center gap-2">
							<ArrowLeft className="w-4 h-4" />
							{t("workflow.actions.addLeftNode")}
						</DropdownMenuItem>
						<DropdownMenuItem onClick={handleAddRightNode} className="flex items-center gap-2">
							<ArrowRight className="w-4 h-4" />
							{t("workflow.actions.addRightNode")}
						</DropdownMenuItem>
						<DropdownMenuItem 
							onClick={handleDeleteTask} 
							className="flex items-center gap-2 text-red-600 focus:text-red-600"
						>
							<Trash2 className="w-4 h-4" />
							{t("workflow.actions.deleteTask")}
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			{/* Content */}
			<div className="p-4">
				<h3 className="text-foreground font-medium text-lg mb-3">
					{data.title}
				</h3>
				
				<div className="flex items-center justify-center space-x-2">
					{getStatusIcon()}
					<span className="text-muted-foreground text-sm">{getStatusText()}</span>
				</div>
			</div>

			<Handle type="source" position={Position.Right} className="w-3 h-3" />
		</div>
	);
});