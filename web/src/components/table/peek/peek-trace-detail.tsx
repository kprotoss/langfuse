import { usePeekData } from "@/src/components/table/peek/hooks/usePeekData";
import { useRouter } from "next/router";
import { Trace } from "@/src/components/trace2/Trace";
import { Skeleton } from "@/src/components/ui/skeleton";
import {
  type DataTablePeekViewProps,
  TablePeekView,
} from "@/src/components/table/peek";

type TablePeekViewTraceProps = {
  projectId: string;
} & Pick<
  DataTablePeekViewProps,
  | "itemType"
  | "detailNavigationKey"
  | "resolveDetailNavigationPath"
  | "closePeek"
  | "expandPeek"
  | "peekEventOptions"
>;

export const TablePeekViewTrace = ({
  projectId,
  ...peekViewProps
}: TablePeekViewTraceProps) => {
  const router = useRouter();
  const peekId = router.query.peek as string | undefined;
  const timestamp = router.query.timestamp
    ? new Date(router.query.timestamp as string)
    : undefined;
  const trace = usePeekData({
    projectId,
    traceId: peekId,
    timestamp,
  });

  const title = trace.data?.name
    ? `${trace.data.name}: ${trace.data.id}`
    : trace.data?.id;

  return (
    <TablePeekView {...peekViewProps} title={title} isLoading={trace.isLoading}>
      {!peekId || !trace.data ? (
        <Skeleton className="h-full w-full rounded-none" />
      ) : (
        <Trace
          key={trace.data.id}
          trace={trace.data}
          scores={trace.data.scores}
          corrections={trace.data.corrections}
          projectId={trace.data.projectId}
          observations={trace.data.observations}
          context="peek"
        />
      )}
    </TablePeekView>
  );
};
