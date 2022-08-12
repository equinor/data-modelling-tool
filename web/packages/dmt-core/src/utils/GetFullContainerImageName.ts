import { TContainerImage } from '../types'

export const getFullContainerImageName = (image: TContainerImage): string => {
  return `${image.registryName}/${image.imageName}:${image.version}`
}
