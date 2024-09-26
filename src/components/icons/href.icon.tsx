import { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {

}

const HrefIcon = (props: Props) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 21 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M3.40234 17.1562C2.77214 16.526 2.35286 15.8333 2.14453 15.0781C1.9362 14.3177 1.9362 13.5599 2.14453 12.8047C2.35807 12.0495 2.77474 11.3594 3.39453 10.7344L5.69141 8.44531C5.64974 8.70052 5.64193 8.96875 5.66797 9.25C5.69922 9.52604 5.76953 9.78646 5.87891 10.0312L4.34766 11.5625C3.89453 12.0156 3.59245 12.5156 3.44141 13.0625C3.29036 13.6094 3.29036 14.1589 3.44141 14.7109C3.59245 15.2578 3.89453 15.7604 4.34766 16.2188C4.80078 16.6719 5.30078 16.9714 5.84766 17.1172C6.39974 17.2682 6.94922 17.2682 7.49609 17.1172C8.04297 16.9661 8.54297 16.6641 8.99609 16.2109L11.207 14.0078C11.3477 13.862 11.4701 13.7135 11.5742 13.5625C11.4961 13.8854 11.4544 14.2083 11.4492 14.5312C11.444 14.849 11.4674 15.1641 11.5195 15.4766L9.82422 17.1719C9.20443 17.7969 8.51693 18.2135 7.76172 18.4219C7.00651 18.6302 6.2487 18.6302 5.48828 18.4219C4.73307 18.2135 4.03776 17.7917 3.40234 17.1562ZM9.33203 8.10938L10.3711 7.05469C10.8711 7.14323 11.2878 7.27344 11.6211 7.44531C11.9544 7.61198 12.2435 7.82031 12.4883 8.07031C12.8164 8.39323 13.0846 8.73698 13.293 9.10156C13.5065 9.46615 13.6654 9.84115 13.7695 10.2266C13.5143 10.4036 13.2799 10.6068 13.0664 10.8359C12.8529 11.0599 12.6654 11.3047 12.5039 11.5703C12.556 11.1224 12.5013 10.6771 12.3398 10.2344C12.1836 9.79167 11.918 9.38281 11.543 9.00781C11.2878 8.7526 10.9831 8.54948 10.6289 8.39844C10.2799 8.2474 9.84766 8.15104 9.33203 8.10938ZM8.05859 12.4766C7.42318 11.8464 7.0013 11.1536 6.79297 10.3984C6.58464 9.63802 6.58464 8.88021 6.79297 8.125C7.00651 7.36979 7.42578 6.67969 8.05078 6.05469L10.7148 3.38281C11.3398 2.75781 12.0299 2.34115 12.7852 2.13281C13.5404 1.91927 14.2956 1.91667 15.0508 2.125C15.8112 2.33333 16.5091 2.75521 17.1445 3.39062C17.7122 3.96354 18.1081 4.59635 18.332 5.28906C18.556 5.97656 18.6055 6.66927 18.4805 7.36719C18.3607 8.0599 18.0664 8.69792 17.5977 9.28125L17.3867 9.50781C17.1263 9.45573 16.8346 9.4349 16.5117 9.44531C16.194 9.45573 15.8997 9.49219 15.6289 9.55469L16.1992 8.98438C16.6523 8.53125 16.9544 8.03125 17.1055 7.48438C17.2565 6.9375 17.2565 6.39062 17.1055 5.84375C16.9544 5.29167 16.6523 4.78906 16.1992 4.33594C15.7409 3.8776 15.2383 3.57552 14.6914 3.42969C14.1445 3.27865 13.5977 3.27865 13.0508 3.42969C12.5039 3.58073 12.0013 3.88281 11.543 4.33594L8.99609 6.88281C8.54297 7.33594 8.24089 7.83594 8.08984 8.38281C7.9388 8.92969 7.9388 9.47917 8.08984 10.0312C8.24089 10.5781 8.54557 11.0807 9.00391 11.5391C9.22786 11.763 9.49349 11.9505 9.80078 12.1016C10.1081 12.2526 10.4805 12.3646 10.918 12.4375C10.7565 12.6094 10.5951 12.7839 10.4336 12.9609C10.2721 13.1328 10.1081 13.3073 9.94141 13.4844C9.50391 13.375 9.13672 13.237 8.83984 13.0703C8.54297 12.8984 8.28255 12.7005 8.05859 12.4766ZM16.4492 18.4141C15.9076 18.4141 15.3971 18.3099 14.918 18.1016C14.4388 17.8984 14.0169 17.6146 13.6523 17.25C13.2878 16.8854 13.0013 16.4635 12.793 15.9844C12.5846 15.5052 12.4805 14.9922 12.4805 14.4453C12.4805 13.8984 12.5846 13.388 12.793 12.9141C13.0013 12.4349 13.2878 12.013 13.6523 11.6484C14.0169 11.2786 14.4388 10.9922 14.918 10.7891C15.3971 10.5807 15.9076 10.4766 16.4492 10.4766C16.9961 10.4766 17.5091 10.5807 17.9883 10.7891C18.4674 10.9922 18.8893 11.276 19.2539 11.6406C19.6185 12.0052 19.9023 12.4271 20.1055 12.9062C20.3138 13.3854 20.418 13.8984 20.418 14.4453C20.418 14.987 20.3138 15.4974 20.1055 15.9766C19.8971 16.4557 19.6081 16.8776 19.2383 17.2422C18.8737 17.6068 18.4518 17.8932 17.9727 18.1016C17.4935 18.3099 16.9857 18.4141 16.4492 18.4141ZM16.4492 16.9297C16.5951 16.9297 16.7096 16.8854 16.793 16.7969C16.8815 16.7083 16.9258 16.5938 16.9258 16.4531V14.9219H18.457C18.5977 14.9219 18.7122 14.8802 18.8008 14.7969C18.8893 14.7083 18.9336 14.5911 18.9336 14.4453C18.9336 14.2995 18.8893 14.1849 18.8008 14.1016C18.7122 14.013 18.5977 13.9688 18.457 13.9688H16.9258V12.4375C16.9258 12.2969 16.8815 12.1823 16.793 12.0938C16.7096 12.0052 16.5951 11.9609 16.4492 11.9609C16.3034 11.9609 16.1862 12.0052 16.0977 12.0938C16.0143 12.1823 15.9727 12.2969 15.9727 12.4375V13.9688H14.4414C14.3008 13.9688 14.1862 14.013 14.0977 14.1016C14.0091 14.1849 13.9648 14.2995 13.9648 14.4453C13.9648 14.5911 14.0091 14.7083 14.0977 14.7969C14.1862 14.8802 14.3008 14.9219 14.4414 14.9219H15.9727V16.4531C15.9727 16.5938 16.0143 16.7083 16.0977 16.7969C16.1862 16.8854 16.3034 16.9297 16.4492 16.9297Z"
      fill="currentColor"
    />
  </svg>
);

export { HrefIcon };