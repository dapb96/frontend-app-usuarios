import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { Demandante, Empleado } from '../../models/user-model';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.css'
})
export class UserFormComponent implements OnInit {
  userId: string | null = null;
  isEditMode: boolean = false;
  userForm!: FormGroup;
  userType: 'demandante' | 'empleado' = 'demandante'; // Default type

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {
    this.actualizarFormGroup();
  }

  actualizarFormGroup(): void {
    this.userForm = this.fb.group({
      tipo: ['demandante', Validators.required],
      datosPersonales: this.fb.group({
        nifPasaporte: ['', Validators.required],
        nombre: ['', Validators.required],
        primerApellido: ['', Validators.required],
        segundoApellido: [''],
        genero: [''],
        fechaNacimiento: [''],
      }),
      direccion: this.fb.group({
        calle: ['', Validators.required],
        numero: [''],
        puerta: [''],
        codigoPostal: ['', Validators.required],
        ciudad: ['', Validators.required],
      }),
      estudios: this.fb.array([]),
      experienciaLaboral: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.userId = params['id'];
      console.log('Valor del parámetro id:', this.userId);
      this.isEditMode = this.userId !== 'new';
      if (this.isEditMode && this.userId) {
        this.loadUserToEdit(this.userId);
      } else {
        this.addEstudio();
      }
    });

    this.userForm.get('tipo')?.valueChanges.subscribe(type => {
      this.userType = type;
      this.clearSpecificFields();
      if (type === 'demandante') {
        this.addEstudio();
      } else if (type === 'empleado') {
        this.addExperienciaLaboral();
      }
    });
  }
  
  loadUserToEdit(nifPasaporte: string): void {
    this.userService.getUsers().subscribe(users => {
      const userToEdit = users.find(user => user.datosPersonales.nifPasaporte === nifPasaporte);
      if (userToEdit) {
        this.userType = userToEdit.tipo;
        this.userForm.patchValue(userToEdit);
        if (userToEdit.tipo === 'demandante' && userToEdit.estudios) {
          this.setEstudios(userToEdit.estudios);
        } else if (userToEdit.tipo === 'empleado' && userToEdit.experienciaLaboral) {
          this.setExperienciaLaboral(userToEdit.experienciaLaboral);
        }
      } else {
        console.error('Usuario no encontrado');
        this.router.navigate(['/users']);
      }
    });
  }

  clearSpecificFields(): void {
    this.estudios.clear();
    this.experienciaLaboral.clear();
  }

  // Estudios
  get estudios(): FormArray {
    return this.userForm.get('estudios') as FormArray;
  }

  newEstudio(): FormGroup {
    return this.fb.group({
      nombreInstitucion: ['', Validators.required],
      titulacion: ['', Validators.required],
      fecha: [''],
    });
  }

  addEstudio(): void {
    this.estudios.push(this.newEstudio());
  }

  removeEstudio(index: number): void {
    this.estudios.removeAt(index);
  }

  setEstudios(estudios: any[]): void {
    this.estudios.clear();
    estudios.forEach(estudio => this.estudios.push(this.fb.group(estudio)));
  }

  // Experiencia Laboral
  get experienciaLaboral(): FormArray {
    return this.userForm.get('experienciaLaboral') as FormArray;
  }

  newExperienciaLaboral(): FormGroup {
    return this.fb.group({
      nombreEmpresa: ['', Validators.required],
      puestoTrabajo: ['', Validators.required],
      fecha: [''],
    });
  }

  addExperienciaLaboral(): void {
    this.experienciaLaboral.push(this.newExperienciaLaboral());
  }

  removeExperienciaLaboral(index: number): void {
    this.experienciaLaboral.removeAt(index);
  }

  setExperienciaLaboral(experienciaLaboral: any[]): void {
    this.experienciaLaboral.clear();
    experienciaLaboral.forEach(exp => this.experienciaLaboral.push(this.fb.group(exp)));
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      const userData = this.userForm.value as Demandante | Empleado;
      if (this.isEditMode && this.userId) {
        this.userService.updateUser({ ...userData, datosPersonales: { ...userData.datosPersonales, nifPasaporte: this.userId } });
      } else {
        this.userService.addUser(userData);
      }
      this.router.navigate(['/users']);
      console.log('Formulario válido, datos:', userData);
      // Aquí simularíamos el guardado de los datos (ej. en un fichero de texto)
    } else {
      // Marcar todos los controles como "touched" para mostrar los errores
      this.markAllAsTouched(this.userForm);
    }
  }

  markAllAsTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markAllAsTouched(control);
      } else if (control instanceof FormArray) {
        control.controls.forEach(formGroup => {
          if (formGroup instanceof FormGroup) {
            this.markAllAsTouched(formGroup);
          }
        });
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/users']);
  }
}
