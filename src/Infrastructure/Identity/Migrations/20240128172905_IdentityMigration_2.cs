using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Identity.Migrations
{
    /// <inheritdoc />
    public partial class IdentityMigration_2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "ix_identity_tokens_ip_address",
                table: "identity_tokens");

            migrationBuilder.UpdateData(
                table: "identity_tokens",
                keyColumn: "id",
                keyValue: 1L,
                column: "expiration",
                value: new DateTime(2024, 2, 4, 20, 29, 5, 531, DateTimeKind.Local).AddTicks(6675));

            migrationBuilder.UpdateData(
                table: "identity_tokens",
                keyColumn: "id",
                keyValue: 2L,
                column: "expiration",
                value: new DateTime(2024, 2, 4, 20, 29, 5, 531, DateTimeKind.Local).AddTicks(6713));

            migrationBuilder.UpdateData(
                table: "identity_users",
                keyColumn: "id",
                keyValue: 1L,
                column: "date_created",
                value: new DateTimeOffset(new DateTime(2024, 1, 28, 17, 29, 5, 531, DateTimeKind.Unspecified).AddTicks(2103), new TimeSpan(0, 0, 0, 0, 0)));

            migrationBuilder.UpdateData(
                table: "identity_users",
                keyColumn: "id",
                keyValue: 2L,
                column: "date_created",
                value: new DateTimeOffset(new DateTime(2024, 1, 28, 17, 29, 5, 531, DateTimeKind.Unspecified).AddTicks(2107), new TimeSpan(0, 0, 0, 0, 0)));

            migrationBuilder.CreateIndex(
                name: "ix_identity_tokens_ip_address",
                table: "identity_tokens",
                column: "ip_address");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "ix_identity_tokens_ip_address",
                table: "identity_tokens");

            migrationBuilder.UpdateData(
                table: "identity_tokens",
                keyColumn: "id",
                keyValue: 1L,
                column: "expiration",
                value: new DateTime(2023, 9, 3, 10, 47, 25, 636, DateTimeKind.Local).AddTicks(3506));

            migrationBuilder.UpdateData(
                table: "identity_tokens",
                keyColumn: "id",
                keyValue: 2L,
                column: "expiration",
                value: new DateTime(2023, 9, 3, 10, 47, 25, 636, DateTimeKind.Local).AddTicks(3546));

            migrationBuilder.UpdateData(
                table: "identity_users",
                keyColumn: "id",
                keyValue: 1L,
                column: "date_created",
                value: new DateTimeOffset(new DateTime(2023, 8, 27, 7, 47, 25, 635, DateTimeKind.Unspecified).AddTicks(5145), new TimeSpan(0, 0, 0, 0, 0)));

            migrationBuilder.UpdateData(
                table: "identity_users",
                keyColumn: "id",
                keyValue: 2L,
                column: "date_created",
                value: new DateTimeOffset(new DateTime(2023, 8, 27, 7, 47, 25, 635, DateTimeKind.Unspecified).AddTicks(5151), new TimeSpan(0, 0, 0, 0, 0)));

            migrationBuilder.CreateIndex(
                name: "ix_identity_tokens_ip_address",
                table: "identity_tokens",
                column: "ip_address",
                unique: true);
        }
    }
}
