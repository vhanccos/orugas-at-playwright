export async function esperaTiempo(tiempo: number): Promise<void> {
    await new Promise(res => setTimeout(res, tiempo));
}