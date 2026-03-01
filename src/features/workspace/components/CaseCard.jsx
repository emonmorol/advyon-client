import React from 'react';
import { Briefcase, Clock, MoreVertical, Archive, Trash2 } from 'lucide-react';
import { cn } from "@/lib/utils";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCasesStore } from '@/store/cases';
import { toast } from 'sonner';

const CaseCard = ({ data, onOpen }) => {
    const { deleteCase, archiveCase } = useCasesStore();

    const handleArchive = async (e) => {
        e.stopPropagation();
        try {
            await archiveCase(data.id || data._id);
            toast.success('Case archived successfully');
        } catch (error) {
            console.error(error);
            toast.error('Failed to archive case');
        }
    };

    const handleDelete = async (e) => {
        e.stopPropagation();
        try {
            await deleteCase(data.id || data._id);
            toast.success('Case deleted successfully');
        } catch (error) {
            console.error(error);
            toast.error('Failed to delete case');
        }
    };

    return (
    <div
        onClick={() => onOpen(data)}
        className="bg-card border border-accent/20 rounded-xl p-4 hover:bg-secondary hover:border-accent/40 transition-all cursor-pointer group flex flex-col h-full shadow-sm hover:shadow-lg animate-in fade-in zoom-in-95 duration-300"
    >
        <div className="flex items-start justify-between mb-3">
            <div>
                <h3 className="text-base font-bold text-card-foreground group-hover:text-accent transition-colors">{data.title}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Ref: {data.ref}</p>
            </div>
            <div className="flex items-center gap-2">
                <div className={cn(
                    "px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border",
                    data.urgency === 'high' ? "bg-destructive/10 text-destructive border-destructive/30" :
                        data.urgency === 'medium' ? "bg-accent/10 text-accent border-accent/30" :
                            "bg-teal-accent/10 text-teal-bright border-teal-accent/30"
                )}>
                    {data.urgency}
                </div>
                {/* Action Menu */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button
                            onClick={(e) => e.stopPropagation()}
                            className="p-1 rounded-md hover:bg-secondary text-muted-foreground transition-colors"
                        >
                            <MoreVertical size={16} />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40 z-50">
                        <DropdownMenuItem onClick={handleArchive} className="cursor-pointer gap-2">
                            <Archive size={14} />
                            <span>Archive</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleDelete} className="cursor-pointer text-destructive focus:bg-destructive focus:text-destructive-foreground gap-2">
                            <Trash2 size={14} />
                            <span>Delete</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>

        <div className="space-y-2 mb-4 flex-1">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Briefcase size={10} /> {data.type}</span>
                <span className="flex items-center gap-1"><Clock size={10} /> {data.nextDeadline}</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-1 overflow-hidden">
                <div className="bg-accent h-full rounded-full" style={{ width: `${data.progress}%` }}></div>
            </div>
        </div>

        <div className="flex items-center justify-between mt-auto pt-3 border-t border-accent/20">
            <div className="flex -space-x-1.5">
                <div className="w-5 h-5 rounded-full bg-secondary border border-background flex items-center justify-center text-[7px] text-foreground">JD</div>
                <div className="w-5 h-5 rounded-full bg-primary border border-background flex items-center justify-center text-[7px] text-primary-foreground">AB</div>
            </div>
            <span className="text-xs font-medium text-teal-accent group-hover:text-accent transition-colors">Open &rarr;</span>
        </div>
    </div>
    );
};

export default CaseCard;
