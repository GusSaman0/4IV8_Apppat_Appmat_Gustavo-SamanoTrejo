import java.util.Scanner;

public class Examen_Primer_Parcial
{
    public static void main(String[] args)
    {
        //para la moda necesito ordenar y verificar los que mas se repiten, la mediana es encontrar el numero de enmedio y media es sumar y dividir entre length
        Scanner scString = new Scanner(System.in);
        Scanner scInt = new Scanner(System.in);
        int i = 0,num = 0, moda=0, media=0, mediana=0,n=0, cant =0;
        String acu = "";
        boolean salir = true;

        System.out.println("ingresa la cantida de numeros que gustas ingresa");
        cant = scInt.nextInt();
        int[] numero = new int[cant];

        for (i = 0; i < cant; i++) {
            System.out.println("Ingresa el numero que gustas ingresar");
            numero[i] = scInt.nextInt();
            
            media += numero[i]/numero.length;
            //organizar los datos
            if(i > 1)
            {
                numero[i-1] = num;
                numero = new int[i];
                for (int k = 0; k < n - 1; k++) {
                    for (int j = 0; j < n - i - 1; j++) {
                        if (numero[j] > numero[j + 1]) {
                            int temp = numero[j];
                            numero[j] = numero[j + 1];
                            numero[j + 1] = temp;
                        }
                    }  
                }
            }

            //moda
            
            //mediana
            
            //media
        }
        //moda, mediana y media
        System.out.println("lista de numeros" + acu);
        System.out.println("moda: ");
        System.out.println("mediana: ");

        System.out.println("media: " + media);
        scString.close();
    }
}