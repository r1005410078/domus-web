"use client";

import React, { useState, useEffect } from "react";
import { PropertyData, TaskItem, AppView } from "./types";
import InputSection from "./components/InputSection";
import HistoryList from "./components/HistoryList";
import { processPropertyInput } from "@/services/gemini";
import { Box, DialogTitle, Drawer, ModalClose } from "@mui/joy";
import House from "../House";
const INITIAL_PROPERTY_DATA: PropertyData = {
  communityName: "",
  sale_price: 0,
  sale_low_price: 0,
  rent_price: 0,
  rent_low_price: 0,
  rentOrSale: "Rent",
  layout: {
    room: 0,
    hall: 0,
    bathroom: 0,
    kitchen: 0,
    terrace: 0,
  },
  area: 0,
  floor: 0,
  orientation: "",
  contactName: "",
  contactPhone: "",
  additionalNotes: "",
  address: "",
};

function QuickNote() {
  const [view, setView] = useState<AppView>(AppView.CREATE);
  const [tasks, setTasks] = useState<TaskItem[]>([]);

  // Current Editing State
  const [editingTask, setEditingTask] = useState<TaskItem | null>(null);
  const [formData, setFormData] = useState<PropertyData>(INITIAL_PROPERTY_DATA);

  // UI States
  const [showForm, setShowForm] = useState(false);

  // Load tasks from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem("property_tasks");
    if (saved) {
      try {
        const parsed: TaskItem[] = JSON.parse(saved);
        setTasks(parsed);
      } catch (e) {
        console.error("Failed to load tasks", e);
      }
    }
  }, []);

  // Save tasks to local storage whenever it changes
  useEffect(() => {
    const cleanTasks = tasks.map((t) => {
      if (t.status === "processing") return t;

      if (t.status === "failed") {
        return {
          ...t,
          sourceInput: {
            ...t.sourceInput,
            image: null,
            audio: null,
            text: t.sourceInput?.text || "",
          },
        };
      }
      return t;
    });
    localStorage.setItem("property_tasks", JSON.stringify(cleanTasks));
  }, [tasks]);

  // --- Task Helpers ---

  const createSuccessTasks = (listings: PropertyData[]) => {
    const newTasks: TaskItem[] = listings.map((data) => ({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      status: "success",
      description: `${data.communityName} ${data.layout.room}室${data.layout.hall}厅 ${data.layout.bathroom}卫${data.layout.kitchen}厨${data.layout.terrace}阳台 ${data.area}m² ${data.sale_price ?? data.rent_price}元`,
      extractedData: data,
      isPublished: false,
    }));
    return newTasks;
  };

  const createFailedTask = (
    text: string,
    image: File | null,
    audio: Blob | null,
    errorMsg: string
  ) => {
    let desc = text;
    if (!desc) {
      if (audio) desc = "[语音输入]";
      else if (image) desc = "[图片输入]";
      else desc = "未知输入";
    }

    const newTask: TaskItem = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      status: "failed",
      description: desc,
      errorMessage: errorMsg,
      sourceInput: {
        text,
        image,
        audio,
      },
    };
    return newTask;
  };

  const createProcessingTask = (
    text: string,
    image: File | null,
    audio: Blob | null
  ) => {
    let desc = text;
    if (!desc) {
      if (audio) desc = "[语音输入]";
      else if (image) desc = "[图片输入]";
      else desc = "未知输入";
    }
    return {
      id: "processing-" + Date.now(),
      timestamp: Date.now(),
      status: "processing" as const,
      description: desc,
      sourceInput: { text, image, audio },
    };
  };

  // --- Core Processing Logic ---

  const runGeminiProcessing = async (
    taskId: string,
    text: string,
    image: File | null,
    audio: Blob | null
  ) => {
    try {
      const listings = await processPropertyInput(text);
      console.log("listings", listings);
      if (listings.length > 0) {
        const successTasks = createSuccessTasks(listings);
        setTasks((prev) => {
          const filtered = prev.filter((t) => t.id !== taskId);
          return [...successTasks, ...filtered];
        });
      } else {
        throw new Error("未能识别到有效房源信息");
      }
    } catch (error: any) {
      const failedTask = createFailedTask(
        text,
        image,
        audio,
        error.message || "未知错误"
      );
      setTasks((prev) => {
        const filtered = prev.filter((t) => t.id !== taskId);
        return [failedTask, ...filtered];
      });
    }
  };

  const handleProcess = (
    text: string,
    image: File | null,
    audio: Blob | null
  ) => {
    const processingTask = createProcessingTask(text, image, audio);
    setTasks((prev) => [processingTask, ...prev]);

    // Process without changing view, as logs are now on the same page
    runGeminiProcessing(processingTask.id, text, image, audio);
  };

  const handleRetry = (item: TaskItem) => {
    if (!item.sourceInput) return;

    setTasks((prev) => prev.filter((t) => t.id !== item.id));

    const processingTask = createProcessingTask(
      item.sourceInput.text,
      item.sourceInput.image || null,
      item.sourceInput.audio || null
    );
    setTasks((prev) => [processingTask, ...prev]);
    runGeminiProcessing(
      processingTask.id,
      item.sourceInput.text,
      item.sourceInput.image || null,
      item.sourceInput.audio || null
    );
  };

  // --- Form Handlers ---

  const handleSelectTask = (item: TaskItem) => {
    if (item.status === "success" && item.extractedData) {
      setEditingTask(item);
      setFormData({
        ...item.extractedData,
      });
      setShowForm(true);
    }
  };

  const logItems = tasks; // All history (processed, failed, published, unpublished)
  const unpublishedItems = tasks.filter(
    (h) => h.status === "success" && !h.isPublished
  );

  const defaultValues = {
    title: formData.communityName,
    purpose: "住宅",
    house_status: "有效",
    apartment_type: {
      room: formData.layout.room ?? 0,
      // 厅
      hall: formData.layout.hall ?? 0,
      bathroom: formData.layout.bathroom ?? 0,
      kitchen: formData.layout.kitchen ?? 0,
      // 阳台
      terrace: formData.layout.terrace ?? 0,
      // 阳台
      balcony: 0,
    },
    down_payment: 30,
    building_area: formData.area,
    floor_height: formData.floor,
    house_orientation: formData.orientation,
    owner: {
      name: formData.contactName || "房主",
      phone: formData.contactPhone,
    },
    remark: formData.additionalNotes,
    transaction_type: formData.rentOrSale === "Rent" ? "出租" : "出售",
    sale_price: formData.sale_price ? formData.sale_price / 10000 : 0,
    sale_low_price: formData.sale_low_price
      ? formData.sale_low_price / 10000
      : 0,
    rent_price: formData.rent_price,
    rent_low_price: formData.rent_low_price,
    house_address: formData.address,
  };

  if (!defaultValues.sale_low_price) {
    defaultValues.sale_low_price = defaultValues.sale_price;
  }

  if (!defaultValues.rent_low_price) {
    defaultValues.rent_low_price = defaultValues.rent_price;
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20">
      <div className="mx-auto max-w-5xl px-4 ">
        {/* Navigation Tabs (Segmented Control style) */}
        {!showForm && (
          <div className="mt-4 flex justify-center">
            <div className="inline-flex h-11 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground whitespace-nowrap shadow-inner">
              <button
                onClick={() => setView(AppView.CREATE)}
                className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-6 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${view === AppView.CREATE ? "bg-background text-foreground shadow-sm" : "hover:bg-background/50 hover:text-foreground"}`}
              >
                工作台
              </button>
              <button
                onClick={() => setView(AppView.UNPUBLISHED)}
                className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-6 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${view === AppView.UNPUBLISHED ? "bg-background text-foreground shadow-sm" : "hover:bg-background/50 hover:text-foreground"}`}
              >
                待发布 ({unpublishedItems.length})
              </button>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="py-8">
          <div className="mx-auto space-y-8">
            {view === AppView.CREATE && (
              <div className="flex flex-col gap-8">
                {/* Input Section - Removed max-w-3xl for better width alignment */}
                <div className="w-full">
                  <InputSection
                    onProcess={handleProcess}
                    isProcessing={false}
                  />
                </div>

                {/* Task Log integrated here */}
                <div className="w-full">
                  <HistoryList
                    items={logItems}
                    title="任务日志"
                    onSelect={handleSelectTask}
                    onRetry={handleRetry}
                  />
                </div>

                {/* Tips Section */}
                <div className="w-full rounded-xl border bg-card text-card-foreground shadow-sm p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-primary"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 16v-4" />
                        <path d="M12 8h.01" />
                      </svg>
                    </div>
                    <h4 className="font-semibold leading-none tracking-tight">
                      使用小贴士
                    </h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex gap-4 items-start p-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="mt-1 shrink-0 rounded-full bg-muted p-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-muted-foreground"
                        >
                          <path d="m16.24 7.76-2.12 2.12a6 6 0 0 1-8.49 8.49L2.83 21.17a2 2 0 0 1-2.83-2.83l2.8-2.8a6 6 0 0 1 8.49-8.49l2.12-2.12a2 2 0 0 1 2.83 0l2.83 2.83a2 2 0 0 1 0 2.83Z" />
                          <path d="M21 12a9 9 0 1 1-6.21-1.61L12 13.59" />
                        </svg>
                      </div>
                      <div className="text-sm">
                        <span className="font-medium block mb-1">
                          支持批量识别
                        </span>
                        <span className="text-muted-foreground">
                          您可以一次性输入多段描述，AI
                          将自动拆分为多个独立任务。
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-4 items-start p-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="mt-1 shrink-0 rounded-full bg-muted p-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-muted-foreground"
                        >
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        </svg>
                      </div>
                      <div className="text-sm">
                        <span className="font-medium block mb-1">输入示例</span>
                        <span className="text-muted-foreground">
                          "天通苑两居5000，回龙观一居3000，车位出租500/月"
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {view === AppView.UNPUBLISHED && (
              <HistoryList
                items={unpublishedItems}
                title="待发布房源"
                onSelect={handleSelectTask}
                onRetry={() => {}}
              />
            )}
          </div>
        </main>
      </div>

      <Drawer
        anchor="bottom"
        sx={{}}
        slotProps={{
          content: {
            sx: {
              height: "100vh",
              width: { xs: "100%", md: "430px" },
              top: 0,
              left: { xs: 0, md: "calc(50% - 215px)" },
              borderRadius: 0,
              boxShadow: "lg",
              p: 0,
              backgroundColor: "background.body",
              overflow: "auto",
            },
          },
        }}
        open={showForm}
        onClose={(_, reason) => {
          if (reason === "backdropClick") return;
          setShowForm(false);
        }}
      >
        <ModalClose />
        <DialogTitle>发布房源</DialogTitle>
        <Box sx={{ height: "100%", width: { xs: "100%", md: "430px" } }}>
          <House.Form
            key={formData.communityName}
            onSubmit={() => {
              if (!editingTask) return;
              setTasks((prev) =>
                prev.map((t) => {
                  if (t.id === editingTask.id) {
                    return {
                      ...t,
                      extractedData: formData,
                      isPublished: true,
                      description: `${formData.communityName} ${formData.layout} ${formData.sale_price ?? formData.rent_price}元`,
                    };
                  }
                  return t;
                })
              );

              setShowForm(false);
              setEditingTask(null);
              setFormData(INITIAL_PROPERTY_DATA);
            }}
            defaultValues={defaultValues}
          />
        </Box>
      </Drawer>
    </div>
  );
}

export default QuickNote;

const mock = [
  {
    id: "1765081192712fioiaa6ir",
    timestamp: 1765081192712,
    status: "success",
    description: "迎宾北苑 [object Object] 360000元",
    extractedData: {
      communityName: "迎宾北苑",
      rentOrSale: "Sale",
      additionalNotes: "精装修，家具齐全",
      area: 101,
      contactName: "",
      contactPhone: "18255695238",
      floor: 4,
      layout: {
        bathroom: 1,
        hall: 2,
        room: 3,
        terrace: 0,
      },
      orientation: "",
      sale_price: 360000,
    },
    isPublished: false,
  },
  {
    id: "1765081192712wklp5i812",
    timestamp: 1765081192712,
    status: "success",
    description: "瓜园小区 [object Object] 498000元",
    extractedData: {
      communityName: "瓜园小区",
      rentOrSale: "Sale",
      additionalNotes: "家电家具齐全，豪华装修",
      area: 123,
      contactName: "",
      contactPhone: "18255695238",
      floor: 5,
      layout: {
        bathroom: 2,
        hall: 2,
        room: 3,
        terrace: 0,
      },
      orientation: "",
      sale_price: 498000,
      address: "董家弄 10 幢 2单元202",
    },
    isPublished: false,
  },
  {
    id: "17650811927128ftpuovov",
    timestamp: 1765081192712,
    status: "success",
    description: "联富花园 [object Object] 468000元",
    extractedData: {
      communityName: "联富花园",
      rentOrSale: "Sale",
      additionalNotes: "精装，家具齐全",
      area: 96,
      contactName: "",
      contactPhone: "18255695238",
      floor: 2,
      layout: {
        bathroom: 0,
        hall: 2,
        room: 2,
        terrace: 0,
      },
      orientation: "",
      sale_price: 468000,
    },
    isPublished: false,
  },
  {
    id: "17650811927120ctdwj1wg",
    timestamp: 1765081192712,
    status: "success",
    description: "梦歺南苑 [object Object] 568000元",
    extractedData: {
      communityName: "梦歺南苑",
      rentOrSale: "Sale",
      additionalNotes: "豪华装修，家电家具齐全，还有平台",
      area: 111,
      contactName: "",
      contactPhone: "18255695238",
      floor: 2,
      layout: {
        bathroom: 1,
        hall: 2,
        room: 3,
        terrace: 1,
      },
      orientation: "",
      sale_price: 568000,
    },
    isPublished: false,
  },
  {
    id: "1765081192712gx7t5xxpc",
    timestamp: 1765081192712,
    status: "success",
    description: "金星小区 [object Object] 498000元",
    extractedData: {
      communityName: "金星小区",
      rentOrSale: "Sale",
      additionalNotes: "豪华装修，家具齐全",
      area: 137,
      contactName: "",
      contactPhone: "18255695238",
      floor: 5,
      layout: {
        bathroom: 2,
        hall: 2,
        room: 3,
        terrace: 0,
      },
      orientation: "",
      sale_price: 498000,
    },
    isPublished: false,
  },
];
