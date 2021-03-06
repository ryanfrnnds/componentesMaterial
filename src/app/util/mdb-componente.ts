
import { FormControl, FormBuilder, AbstractControl } from '@angular/forms';
import { EventEmitter } from '@angular/core';
import { UrlSegment, Router, ActivatedRoute } from '@angular/router';
import { MDB } from './mdb';

export class MDBComponente {
  public onPesquisar = new EventEmitter<any>();
  public onAdicionarEmLista = new EventEmitter<any>();
  public onSalvar = new EventEmitter<any>();
  public onEdicaoLista = new EventEmitter<any>();
  public indiceItemEdicao: number;

  public traducao() {
    return MDB.util().traducao;
  }

  constructor() {}

  public resetar( formulario ) {
    for (const key in  formulario.controls) {
      if (formulario.controls.hasOwnProperty(key)) {
        const control: any = formulario.controls[key];
        if (control.controls) {
          this.resetar(control);
        } else {
          if(control.enabled) {
            control.setValue(undefined);
            control.markAsUntouched();
          }
        }
      }
    }
  }

  public marcarComoTocado( formulario ) {
    for (const key in  formulario.controls) {
      if (formulario.controls.hasOwnProperty(key)) {
        const control: any = formulario.controls[key];
        if (control.controls) {
          this.marcarComoTocado(control);
        } else {
          control.markAsTouched();
        }
      }
    }
  }

  public marcarComoNaoTocado( formulario ) {
    for (const key in  formulario.controls) {
      if (formulario.controls.hasOwnProperty(key)) {
        const control: any = formulario.controls[key];
        if (control.controls) {
          this.marcarComoNaoTocado(control);
        } else {
          control.markAsUntouched();
        }
      }
    }
  }

  public navegarPara(path) {
    MDB.angular().activatedRoute.url.subscribe(urlSegment => {
      const pathDeSaida = this.formarUrl(urlSegment);
      const idConfig: number = MDB.angular().router.config.findIndex(rota => rota.path === pathDeSaida);
      MDB.angular().router.navigate([path], {queryParams : {idConfigRota: idConfig}});
    });
  }

  private formarUrl(lista: UrlSegment[]): string {
    let url = '';
    lista.forEach((urlSegment, indice) => {
      if (lista.length > 1 && indice < (lista.length - 1) ) {
        url += urlSegment.path + '/';
      } else {
        url += urlSegment.path;
      }
    });
    return url;
  }

  public adicionarEmLista<T>(item: T, formulario: AbstractControl = null) {
    if (formulario == null || formulario === undefined || formulario.valid) {
      this.onAdicionarEmLista.emit({item: item});
      this.onAdicionarEmLista = new EventEmitter();
    } else {
      this.marcarComoTocado(formulario);
      this.onAdicionarEmLista = new EventEmitter();
    }
  }

  public salvar(itemASalvar: any, formulario: AbstractControl = null) {
    if (formulario == null || formulario === undefined || formulario.valid) {
      this.onSalvar.emit(itemASalvar);
      this.onSalvar = new EventEmitter();
    } else {
      this.marcarComoTocado(formulario);
      this.onSalvar = new EventEmitter();
    }
    }

  public error(control: AbstractControl, error: string = 'required', msgError: string = 'mdbComponentes.erro.obrigatoriedade') {
    return control.hasError(error) ? MDB.util().traduzir(msgError) : '';
  }

  public edicaoEmLista( lista, indice) {
    this.indiceItemEdicao = indice;
    this.onEdicaoLista.emit({item: lista[indice] });
    this.onEdicaoLista = new EventEmitter();
  }

  public cancelarEdicaoEmLista (formulario: AbstractControl = null) {
    this.indiceItemEdicao = undefined ;
    if (formulario) {
      this.resetar(formulario);
    }
  }

  public limparControle (controle: AbstractControl) {
    controle.reset();
  }

  public traduzir(chave: string , parametros: any = null): string {
    return MDB.util().traduzir(chave,parametros);
  }

  public pesquisar(formulario: AbstractControl = null) {
    if (formulario == null || formulario === undefined || formulario.valid) {
      this.onPesquisar.emit({});
      this.onPesquisar = new EventEmitter<any>();
    } else {
      this.marcarComoTocado(formulario);
      this.onPesquisar = new EventEmitter<any>();
    }
  }

  public seEditandoLista(): boolean {
    return this.indiceItemEdicao != null || this.indiceItemEdicao !== undefined;
  }

  public mostrarSucesso(mensagem: string = null, pathRota:string = null) {
    mensagem =  mensagem ? mensagem : MDB.util().traduzir('mdbComponentes.operacao.sucesso.salvar');
    MDB.servicos().mensagem.addSucesso('',mensagem);
    if(pathRota){
      MDB.angular().router.navigate([pathRota]);
    }
  }

  public mostrarError(httpError, mensagem: string = null) {
    const tituloError = '';
    const mensagemError = mensagem ? mensagem : MDB.util().buscarValor(httpError, 'error.mensagem');
    MDB.servicos().mensagem.addErro(tituloError,mensagemError);
  }
}
