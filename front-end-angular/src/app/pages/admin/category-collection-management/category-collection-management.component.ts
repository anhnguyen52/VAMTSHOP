import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../../service/category.service';
import { CollectionService } from '../../../service/collection.service';
import { ToastService } from '../../../service/toast.service';
import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-category-collection-management',
  templateUrl: './category-collection-management.component.html',
  styleUrl: './category-collection-management.component.css'
})

export class CategoryCollectionManagementComponent implements OnInit {
  constructor(
    private categoryService: CategoryService,
    private collectionService: CollectionService,
    private toastService: ToastService
  ) {}

  categories: any[] = [];
  collections: any[] = [];

  showCategoryModal = false;
  editingCategory: any = null;
  categoryForm = { 
    name: '',
    description: ''
  };

  showCollectionModal = false;
  editingCollection: any = null;
  collectionForm = { name: '', description: '' };
  faPenToSquare = faPenToSquare;
  faTrash = faTrash;
  categoryPage = 1;
  collectionPage = 1;

  ngOnInit() {
    this.loadCategories();
    this.loadCollections();
  }

  loadCategories(){
    this.categoryService.getCategory().subscribe({
      next:  data =>{
        this.categories = data;
      },
      error: err => {
        console.error('Error loading categories', err);
      }
    });
  }

  loadCollections(){
    this.collectionService.getAllCollection().subscribe({
      next: data => {
        this.collections = data;
      },
      error: err => {
        console.error('Error loading collections', err);
      }
    });
  }


  openCategoryModal(cat?: any) {
    this.showCategoryModal = true;
    if (cat) {
      this.editingCategory = cat;
      this.categoryForm = { name: cat.category_name, description: cat.description };
    } else {
      this.editingCategory = null;
      this.categoryForm = { name: '', description: '' };
    }
  }

  closeCategoryModal() {
    this.showCategoryModal = false;
  }

  saveCategory() {
    if (!this.categoryForm.name.trim()) return;
    const payload = {
      category_name: this.categoryForm.name,
      description: this.categoryForm.description || ''
    };

    if (this.editingCategory) {
      this.categoryService.updateCategory(this.editingCategory._id, payload).subscribe({
        next: () => {
          this.toastService.show('Category updated successfully');
          this.loadCategories();
        },
        error: err => {
          this.toastService.show('Error updating category');
          console.error('Error updating category', err);
        }
      });
    } else {
      this.categoryService.createCategory(payload).subscribe({
        next: (newCategory) => {
           this.toastService.show('Category created successfully', newCategory);
          this.loadCategories();
        },
        error: err => {
          console.error('Error creating category', err);
        } 
      });
    }
    this.closeCategoryModal();
  }

  deleteCategory(id: string) {
    if (confirm('Bạn có chắc muốn xóa danh mục này?')) {
      this.categoryService.deleteCategory(id).subscribe({
        next: () => {
          this.toastService.show('Đã xóa danh mục!');
          this.loadCategories();
        },
        error: err => {
          this.toastService.show('Error deleting category');
          console.error('Error deleting category', err);
        }
      });
    }
  }

  // COLLECTION FUNCTIONS
  openCollectionModal(col?: any) {
    this.showCollectionModal = true;
    if (col) {
      this.editingCollection = col;
      this.collectionForm = {
        name: col.collection_name,
        description: col.description
      };
    } else {
      this.editingCollection = null;
      this.collectionForm = { name: '', description: '' };
    }
  }

  closeCollectionModal() {
    this.showCollectionModal = false;
  }

  saveCollection() {
    const payload ={
      collection_name: this.collectionForm.name,  
      description: this.collectionForm.description || ''
    }

    if(this.editingCollection){
      this.collectionService.updateCollection(this.editingCollection._id, payload).subscribe({
        next: () => {
          this.toastService.show('Đã cập nhật tên bộ sưu tập!');
          this.loadCollections();
        },
        error: err => {
          this.toastService.show('Error updating collection');  
          console.error('Error updating collection', err);
        }
      })
    }else{
      this.collectionService.createCollection(payload).subscribe({
        next: (newCollection) => {
          console.log('Collection created successfully', newCollection);
          this.toastService.show('Đã tạo bộ sưu tập mới!');
          this.loadCollections();
        },
        error: err => {
          this.toastService.show('Error creating collection');
          console.error('Error creating collection', err);
        }
      });
    }

    this.closeCollectionModal();
  }

  deleteCollection(id: string) {
    if (confirm('Bạn có chắc muốn xóa bộ sưu tập này?')) {
      this.collectionService.deleteCollection(id).subscribe({
        next: () => {
          this.toastService.show('Đã xóa bộ sưu tập!');
          this.loadCollections();
        },
        error: err => {
          this.toastService.show('Error deleting collection');
          console.error('Error deleting collection', err);
        }
      });
    }
  }
}