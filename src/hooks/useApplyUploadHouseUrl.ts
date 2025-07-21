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
    },
    onError: (err) => {
      toast.showToast({ message: `保存失败: ${err}`, severity: "danger" });
    },
  });
}
