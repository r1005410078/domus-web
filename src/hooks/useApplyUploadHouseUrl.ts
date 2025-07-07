import { useToast } from "@/libs/ToastProvider";
import { applyUploadHouseUrl } from "@/services/house";
import { useMutation } from "@tanstack/react-query";

export function useApplyUploadHouseUrl() {
  const toast = useToast();

  return useMutation({
    mutationFn: applyUploadHouseUrl,
    onSuccess: (res) => {
      if (res.data.code !== 200) {
        toast.showToast({ message: res.data.msg, severity: "danger" });
        return;
      }
      toast.showToast({ message: "录入成功", severity: "success" });
    },
    onError: (err) => {
      toast.showToast({ message: `录入失败: ${err}`, severity: "danger" });
    },
  });
}
