import { TContainerImage } from '../Types'

export const getFullContainerImageName = (image: TContainerImage): string => {
  return `${image.registryName}/${image.imageName}:${image.version}`
}
