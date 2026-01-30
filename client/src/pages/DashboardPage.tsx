import React, { useEffect, useState, useCallback } from 'react';
import { filesApi } from '../api/files';
import type { FileDTO } from '../api/dto';
import { useNavigate } from 'react-router-dom';
import { File as FileIcon, Folder as FolderIcon, LogOut, Upload, Plus, Trash2, CloudUpload, X, AlertTriangle, ArrowLeft, Home, Pencil } from 'lucide-react'; 
import toast from 'react-hot-toast';
import { useAuthStore } from '../store';

export const DashboardPage = () => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  
  const [files, setFiles] = useState<FileDTO[]>([]);
  const [currentFolder, setCurrentFolder] = useState<number | null>(null);
  const [currentFolderInfo, setCurrentFolderInfo] = useState<FileDTO | null>(null);
  
  const [dragEnter, setDragEnter] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [fileToDeleteId, setFileToDeleteId] = useState<number | null>(null);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [fileToRename, setFileToRename] = useState<{id: number, name: string} | null>(null);
  const [renameValue, setRenameValue] = useState('');

  const fetchFiles = useCallback(async () => {
    try {
      const { data } = await filesApi.getAll(currentFolder);
      setFiles(data);

      if (currentFolder) {
          const folderResponse = await filesApi.getOne(currentFolder);
          setCurrentFolderInfo(folderResponse.data);
      } else {
          setCurrentFolderInfo(null);
      }

    } catch (err: unknown) {
      // @ts-expect-error err typing
      if (err?.response?.status === 401) {
        logout();
        navigate('/login');
      } else {
         console.error(err);
         toast.error('Не вдалося завантажити файли');
      }
    }
  }, [currentFolder, navigate, logout]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchFiles();
  }, [fetchFiles]);

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast('Ви вийшли з системи', { icon: '👋' });
  };

  const openFolder = (folderId: number) => {
    setCurrentFolder(folderId);
  };

  const handleBack = () => {
    if (!currentFolderInfo) return;
    setCurrentFolder(currentFolderInfo.parentId);
  };

  const handleGoHome = () => {
      setCurrentFolder(null);
  }

  const openCreateFolderModal = () => {
    setNewFolderName('');
    setIsCreateModalOpen(true);
  };

  const createFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;

    try {
      await filesApi.createFolder(newFolderName, currentFolder);
      toast.success('Папку створено');
      fetchFiles();
      setIsCreateModalOpen(false);
    } catch (err) {
      console.error(err);
      toast.error('Не вдалося створити папку');
    }
  };

  const uploadFile = async (file: File) => {
    const loadingToast = toast.loading('Завантаження...');
    try {
      await filesApi.uploadFile(file, currentFolder);
      fetchFiles();
      toast.success('Файл завантажено', { id: loadingToast });
    } catch (err) {
      console.error(err);
      toast.error('Помилка завантаження', { id: loadingToast });
    }
  };

  const handleUploadClick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
    e.target.value = '';
  };
  
  const onClickDeleteIcon = (id: number) => {
      setFileToDeleteId(id);
      setIsDeleteModalOpen(true);
  }

  const confirmDelete = async () => {
      if (!fileToDeleteId) return;

      try {
          await filesApi.remove([fileToDeleteId]);
          toast.success('Файл переміщено у кошик');
          fetchFiles();
          setIsDeleteModalOpen(false);
          setFileToDeleteId(null);
      } catch (err) {
          console.error(err);
          toast.error('Помилка видалення');
      }
  }

  const handleDragEnter = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setDragEnter(true); };
  const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setDragEnter(false); };
  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); };
  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation(); setDragEnter(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) await uploadFile(files[0]);
  };
  const onClickRename = (id: number, name: string) => {
      setFileToRename({ id, name });
      setRenameValue(name);
      setIsRenameModalOpen(true);
  }

  const confirmRename = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!fileToRename || !renameValue.trim()) return;

      try {
          await filesApi.update(fileToRename.id, renameValue);
          toast.success('Перейменовано успішно');
          fetchFiles();
          setIsRenameModalOpen(false);
          setFileToRename(null);
      } catch (err) {
          console.error(err);
          toast.error('Помилка перейменування');
      }
  }

  return (
    <div 
        className="min-h-screen bg-gray-50 text-gray-900 font-sans relative"
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
    >
      {/* Overlay Drag-and-Drop */}
      {dragEnter && (
        <div className="absolute inset-0 bg-blue-500/10 backdrop-blur-sm z-50 flex items-center justify-center border-4 border-blue-500 border-dashed m-4 rounded-xl pointer-events-none">
            <div className="text-blue-600 flex flex-col items-center animate-bounce">
                <CloudUpload size={80} />
                <span className="text-2xl font-bold mt-4">Відпустіть файл тут</span>
            </div>
        </div>
      )}

      {/* Модальні вікна (Створення та Видалення) */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">Нова папка</h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={createFolder}>
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Введіть назву..."
                  className="w-full border-2 border-gray-200 rounded-xl p-3 focus:outline-none focus:border-blue-500 transition"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  autoFocus
                />
              </div>
              <div className="flex gap-3 justify-end">
                <button type="button" onClick={() => setIsCreateModalOpen(false)} className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg">Скасувати</button>
                <button type="submit" disabled={!newFolderName.trim()} className="px-4 py-2 bg-blue-600 text-white rounded-lg">Створити</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {isRenameModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Перейменувати</h3>
            <form onSubmit={confirmRename}>
              <input
                className="w-full border-2 border-gray-200 rounded-xl p-3 mb-4 focus:outline-none focus:border-blue-500"
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                autoFocus
              />
              <div className="flex gap-3 justify-end">
                <button type="button" onClick={() => setIsRenameModalOpen(false)} className="px-4 py-2 bg-gray-100 rounded-lg">Скасувати</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg">Зберегти</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
               <AlertTriangle className="text-red-500" size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Видалити файл?</h3>
            <div className="flex gap-3 justify-center mt-6">
              <button onClick={() => setIsDeleteModalOpen(false)} className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg w-full">Скасувати</button>
              <button onClick={confirmDelete} className="px-4 py-2 bg-red-500 text-white rounded-lg w-full">Видалити</button>
            </div>
          </div>
        </div>
      )}

      <header className="bg-white shadow p-4 flex justify-between items-center px-8 relative z-10">
        <h1 className="text-xl font-bold text-blue-600 flex items-center gap-2">
            ☁ Cloud Storage
        </h1>
        
        <div className="flex items-center gap-6">
            {user && (
                <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
                    <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                        {user.fullName ? user.fullName[0].toUpperCase() : 'U'}
                    </div>
                    <div className="text-sm">
                        <p className="font-semibold text-gray-700">{user.fullName}</p>
                    </div>
                </div>
            )}
            <button onClick={handleLogout} className="flex items-center gap-2 text-gray-400 hover:text-red-500 transition text-sm font-medium">
            <LogOut size={18} /> 
            </button>
        </div>
      </header>

      <main className="p-8 container mx-auto relative z-10">
        <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-xl shadow-sm">
            <div className="flex gap-4">
                <label className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer transition shadow-blue-200 shadow-md">
                    <Upload size={18} /> 
                    <span>Завантажити</span>
                    <input type="file" className="hidden" onChange={handleUploadClick} />
                </label>
                <button onClick={openCreateFolderModal} className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition border border-gray-200">
                    <Plus size={18} /> Папка
                </button>
            </div>

            {/* --- НАВІГАЦІЯ --- */}
            {currentFolder && (
                <div className="flex gap-2">
                    <button onClick={handleBack} className="flex items-center gap-2 text-gray-600 hover:text-blue-600 font-medium bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 transition">
                        <ArrowLeft size={18} /> Назад
                    </button>
                     <button onClick={handleGoHome} className="flex items-center gap-2 text-gray-500 hover:text-blue-500 font-medium px-3 py-2 rounded-lg transition" title="В корінь">
                        <Home size={18} />
                    </button>
                </div>
            )}
        </div>

        <h2 className="text-lg font-semibold mb-4 text-gray-700 flex items-center gap-2">
            {currentFolder ? (
                <>
                    <span className="text-gray-400">Мої файли /</span>
                    <span>{currentFolderInfo?.originalName || 'Завантаження...'}</span>
                </>
            ) : '📂 Мої файли'}
        </h2>

        {/* ... Grid з файлами... */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {files.map((file) => (
            <div
              key={file.id}
              className="group relative bg-white p-4 rounded-xl shadow-sm hover:shadow-lg transition cursor-pointer flex flex-col items-center gap-3 border border-gray-100"
            >
              <div 
                className="w-full flex flex-col items-center gap-2"
                onClick={() => {
                    if (file.isFolder) {
                        openFolder(file.id);
                    } else {
                        window.open('http://localhost:3000/' + file.path, '_blank');
                    }
                }}
              >
                <div className="text-blue-500 transition-transform group-hover:scale-105">
                    {file.isFolder ? (
                    <FolderIcon size={56} className="fill-yellow-100 text-yellow-500" />
                    ) : (
                    <FileIcon size={56} className="text-indigo-400" />
                    )}
                </div>
                <span className="text-sm font-medium truncate w-full text-center text-gray-700">
                    {file.originalName}
                </span>
              </div>
              <button onClick={(e) => { e.stopPropagation(); onClickDeleteIcon(file.id); }} className="absolute top-2 right-2 p-1 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition"><Trash2 size={16} /></button>
              {/* Кнопка редагування */}
              <button onClick={(e) => { e.stopPropagation(); onClickRename(file.id, file.originalName); }}
                className="absolute top-2 left-2 p-1 text-gray-300 hover:text-blue-500 opacity-0 group-hover:opacity-100 transition">
                <Pencil size={16} />
              </button>
            </div>
          ))}

          {files.length === 0 && (
             <div className="col-span-full flex flex-col items-center justify-center text-gray-400 py-20 border-2 border-dashed border-gray-200 rounded-xl">
               <CloudUpload size={48} className="mb-2 opacity-20" />
               <p>Перетягніть файли сюди</p>
             </div>
          )}
        </div>
      </main>
    </div>
  );
};