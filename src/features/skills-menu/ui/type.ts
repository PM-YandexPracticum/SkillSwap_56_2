import { ReactNode} from "react";





export interface SkillsCategory{ 
id:string;
title:string;
skills:string[]
icon?:ReactNode;
}



export interface SkillsMenuProps{
className?:string; // возмодность передать внешний класс стиля
}